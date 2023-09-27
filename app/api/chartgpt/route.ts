import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { format } from 'sql-formatter'
import { log } from 'console'
import { Message } from 'ai'
import { output } from '@/next.config'

export const runtime = 'edge'


function parseChartGPTResult(result: any): string {
  let output_value = ''

  console.log(`Received result for job ID: ${result.id}`)

  const outputs = result.outputs
  const attempts = result.attempts

  if (!outputs.length) {
    for (const attempt of attempts) {
      if (attempt.outputs.length) {
        output_value += `I'm thinking... 🤔\n\n`
      }
    }
  }

  if (outputs.length && outputs[0]?.value) {
    const output = outputs[0]
    console.log(`${result.id}: Processing output of type ${output.type}`)
    console.debug(`${result.id}: First 10 characters of output: ${output.value.substring(0, 10)}`)
    console.debug(`${result.id}: Last 10 characters of output: ${output.value.substring(output.value.length - 10)}`)
    if (output.type === "sql_query") {
      output_value += output.description
      output_value += "\n"
      output_value += "```sql\n"
      output_value += format(output.value, { language: 'bigquery' })
      output_value += "\n```"
      output_value += "\n"
    } else if (output.type === "pandas_dataframe") {
      // output_value += output.description
      output_value += "\n"
      output_value += "```table\n"
      output_value += output.value
      output_value += "\n```"
      output_value += "\n"
    } else if (output.type === "python_code") {
      output_value += output.description
      output_value += "\n"
      output_value += "```python\n"
      output_value += output.value
      output_value += "\n```"
      output_value += "\n"
    } else if (["string", "int", "float", "bool"].includes(output.type)) {
      // "python_output"
      // output_value += "```\n"
      output_value += output.value.substring(0, 140)
      // output_value += "\n```"
      // output_value += "\n"
    } else if (output.type === "plotly_chart") {
      output_value += "\n"
      output_value += "```chart\n"
      output_value += output.value
      output_value += "\n```"
      output_value += "\n"
    } else {
      console.log(`${result.id}: Unknown or unhandled output type: ${output.type}`)
    }
  }
  return output_value
}


export async function POST(req: Request): Promise<Response> {
  const json = await req.json()
  const { messages, previewToken, dataSourceURL } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const user_messages = messages.filter((message: any) => message.role === 'user')

  const response = await fetch(`${process.env.CHARTGPT_API_HOST}/v1/ask_chartgpt/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHARTGPT_API_KEY ?? '',
    },
    body: JSON.stringify({
      messages: user_messages,
      data_source_url: dataSourceURL,
      output_type: process.env.CHARTGPT_OUTPUT_TYPE,
    })
  })

  if (!response.body || !response.ok) {
    return new Response('API error', {
      status: 500
    })
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  async function onCompletion(completion: String) {
    const title = json.messages[0].content.substring(0, 100)
    const id = json.id ?? nanoid()
    const createdAt = Date.now()
    const path = `/chat/${id}`
    const payload = {
      id,
      title,
      userId,
      createdAt,
      path,
      dataSourceURL,
      messages: [
        ...messages,
        {
          content: completion,
          role: 'assistant',
        }
      ],
    }
    await kv.hmset(`chat:${id}`, payload)
    await kv.zadd(`user:chat:${userId}`, {
      score: createdAt,
      member: `chat:${id}`
    })
  }

  let counter = 0
  let completion = ''

  const stream = new ReadableStream({
    async start(controller) {
      async function onParse(event: ParsedEvent | ReconnectInterval): Promise<void> {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            await onCompletion(completion);
            controller.close();
            return;
          }
          try {
            const result = JSON.parse(data);
            const output_value = parseChartGPTResult(result)
            const queue = encoder.encode(output_value);
            completion += output_value;
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

     // stream response (SSE) may be fragmented into multiple chunks
     // this ensures we properly read chunks & invoke an event for each SSE event stream
     const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return new Response(stream)
}
