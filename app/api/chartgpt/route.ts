import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { format } from 'sql-formatter'

export const runtime = 'edge'


export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const response = await fetch(`${process.env.CHARTGPT_API_HOST}/v1/ask_chartgpt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHARTGPT_API_KEY ?? '',
    },
    body: JSON.stringify({
      messages,
      data_source_url: process.env.CHARTGPT_DATA_SOURCE_URL,
      output_type: process.env.CHARTGPT_OUTPUT_TYPE,
      stream: true,
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

  async function onCompletion(completion: String, type: String) {
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
      messages: [
        ...messages,
        {
          content: completion,
          role: 'assistant',
        }
      ]
    }
    await kv.hmset(`chat:${id}`, payload)
    await kv.zadd(`user:chat:${userId}`, {
      score: createdAt,
      member: `chat:${id}`
    })
  }

  let result = ''
  let completion = ''
  const customStream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read()

      if (done) {
        await onCompletion(completion, "")
        controller.close()
      } else {
        result += decoder.decode(value, {stream:true})
        const lines = result.split('<end>\n')
        result = lines.pop() || ''
  
        for(const line of lines){
          const chunk = line.replace(/^data: /, '');
          const partial_response = JSON.parse(chunk)
          const output = partial_response.outputs[0]
          if (output?.value) {
            let output_value = ""
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
            } else if (["python_output", "string", "int", "float", "bool"].includes(output.type)) {
              output_value += "```\n"
              output_value += output.value
              output_value += "\n```"
              output_value += "\n"
            } else if (output.type === "plotly_chart") {
              output_value += "\n"
              output_value += "```chart\n"
              output_value += output.value
              output_value += "\n```"
              output_value += "\n"
            } else {
              console.log("Unknown or unhandled output type: " + output.type)
            }
  
            // await onCompletion(output_value, output.type)
            completion += output_value
            controller.enqueue(encoder.encode(output_value))
          }
        }
      }
    }
  })

  return new StreamingTextResponse(customStream)
}
