import { kv } from '@/lib/kv'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { format } from 'sql-formatter'
import { Chat } from '@/lib/types'
import { saveChat } from '@/app/actions'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'


function parseChartGPTResult(result: any): string {
  let output_value = ''

  console.debug(`Received result with session ID: ${result.session_id}`)

  const outputs = result.outputs
  const attempts = result.attempts

  if (outputs && !outputs.length) {
    for (const attempt of attempts) {
      if (attempt.outputs.length) {
        output_value += `I'm thinking... 🤔\n\n`
      }
    }
  }

  if (outputs?.length && outputs[0]?.value) {
    const output = outputs[0]
    console.debug(`${result.session_id}: Processing output of type ${output.type}`)
    console.debug(`${result.session_id}: First 10 characters of output: ${output.value.substring(0, 10)}`)
    console.debug(`${result.session_id}: Last 10 characters of output: ${output.value.substring(output.value.length - 10)}`)
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
      output_value += "\n"
      output_value += output.value.substring(0, 140)
      output_value += "\n"
      output_value += "\n"
    } else if (output.type === "plotly_chart") {
      output_value += "\n"
      output_value += "```chart\n"
      output_value += output.value
      output_value += "\n```"
      output_value += "\n"
    } else {
      console.error(`${result.session_id}: Unknown or unhandled output type ${output.type}`)
    }
  }
  return output_value
}


async function onCompletion(
  json: any,
  messages: any,
  userId: string,
  dataSourceURL: string,
  completion: String
) {
  const id = json.id ?? nanoid()
  console.log(`Chat finished: ${id}`)
  const title = json.messages[0].content.substring(0, 100)
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = <Chat>{
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
  try { // Catch UpstashError
    console.debug(`Saving chat: ${id}`)
    const result = await saveChat(id, userId, payload)
    if (result && 'error' in result) {
      console.error(result.error)
    } else {
      console.debug(`Chat saved: ${id}`)
    }
  } catch (error) {
    console.error(error)
    await kv.del(`chat:${id}`)
    await kv.zrem(`user:chat:${userId}`, `chat:${id}`)
    console.error(`Chat failed to save`)
  }
  // const messages_exist = await kv.exists(`chat:${id}:messages`)
  // if (messages_exist) {
  //   await kv.lpush(`chat:${id}:messages`, {
  //     content: completion,
  //     role: 'assistant',
  //   })
  // } else {
  //   await kv.set(`chat:${id}:messages`, [
  //     ...messages, {
  //       content: completion,
  //       role: 'assistant',
  //     }
  //   ])
  // }
}


export async function POST(req: Request): Promise<Response> {
  const json = await req.json()
  const { messages, previewToken, dataSourceURL } = json
  const session = await auth()
  const userId = session?.user.id ?? ''

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const user_messages = messages.filter((message: any) => message.role === 'user')
  // const assistant_messages = messages.filter((message: any) => message.role === 'assistant')

  try {
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
      console.error(response)
      return new Response('API error', {
        status: 500
      })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let completion = ''

    const stream = new ReadableStream({
      async start(controller) {
        let streamEnded = false;

        async function keepAlive() {
          while (!streamEnded) {
            const space = '\u200B'; // Zero Width Space
            const queue = encoder.encode(space);
            controller.enqueue(queue);
            await new Promise(resolve => setTimeout(resolve, 15_000));
          }
        }

        async function onParse(event: ParsedEvent | ReconnectInterval): Promise<void> {
          if (event.type === "event") {
            const data = event.data;
            if (event.event === "stream_start"){
              console.log(`Stream has started`)
              const output_value = 'Coming right up! 🪄\n\n';
              const queue = encoder.encode(output_value);
              completion += output_value;
              controller.enqueue(queue);
            } else if (event.event === "stream_end" || data === "[DONE]"){
              console.log(`Stream has ended`)
              streamEnded = true;
              
              const output_value = 'All done! 🎉\n\n';
              const queue = encoder.encode(output_value);
              completion += output_value;
              controller.enqueue(queue);

              await onCompletion(
                json,
                messages,
                userId,
                dataSourceURL,
                completion,
              );
              controller.close();
              return;
            } else if (event.event === "error") {
              console.error(`ChartGPT analysis error: ${data}`)
              streamEnded = true;

              const output_value = 'Oops, something went wrong! 😢 We are working on it 🚧 \n\n';
              const queue = encoder.encode(output_value);
              completion += output_value;
              controller.enqueue(queue);

              await onCompletion(
                json,
                messages,
                userId,
                dataSourceURL,
                completion,
              );
              controller.close();
              return;
            } else {
              try {
                const result = JSON.parse(data);
                const output_value = result.session_id ? parseChartGPTResult(result) : '';
                const queue = encoder.encode(output_value);
                completion += output_value;
                controller.enqueue(queue);
              } catch (e) {
                controller.error(e);
              }
            }
          }
        }
        
        try {
          keepAlive();
        } catch (e) {}

        // stream response (SSE) may be fragmented into multiple chunks
        // this ensures we properly read chunks & invoke an event for each SSE event stream
        const parser = createParser(onParse);

        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of response.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
      cancel(reason) {
        // Called when the stream is canceled.
        console.log(`Stream canceled: ${reason}`)
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('API error', {
      status: 500,
    })
  }
}
