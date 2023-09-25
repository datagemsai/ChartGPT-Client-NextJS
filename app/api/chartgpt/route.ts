import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { format } from 'sql-formatter'
import { log } from 'console'
import { Message } from 'ai'

export const runtime = 'edge'


export async function POST(req: Request) {
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

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  const encoder = new TextEncoder()

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

  let buffer = ''
  let completion = ''
  const customStream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read()

      if (done) {
        await onCompletion(completion)
        controller.close()
      } else {
        const chunk = decoder.decode(value, {stream:true})
        console.log(`Received ${chunk.length} characters of data`)
        buffer += chunk
        let output_value = ""

        if (buffer.includes('<end>\n')) {
          const results = buffer.split('<end>\n');
          buffer = results.pop() || '';
  
          for(const raw_result of results){
            const result = JSON.parse(raw_result.replace(/^data: /, ''))
            console.log(`${result.id}: Received line of length ${raw_result.length}`)

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
          }
        }
        // await onCompletion(output_value)
        completion += output_value
        controller.enqueue(encoder.encode(output_value))
      }
    }
  })

  return new StreamingTextResponse(customStream)
}
