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

  const response = await fetch('http://localhost:8081/v1/ask_chartgpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHARTGPT_API_KEY ?? '',
    },
    body: JSON.stringify({
      messages,
      // data_source_url: "bigquery/chartgpt-staging/metaquants_nft_finance_aggregator/p2p_and_p2pool_loan_data_borrow",
      data_source_url: "bigquery/chartgpt-staging/real_estate/usa_real_estate_listings",
      output_type: "plotly_chart",
      stream: true,
    })
  })

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
          role: type,
          // type: type,
        }
      ]
    }

    await kv.hmset(`chat:${id}`, payload)
    await kv.zadd(`user:chat:${userId}`, {
      score: createdAt,
      member: `chat:${id}`
    })
  }

  let completion = ""
  const customStream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read()

      if (done) {
        await onCompletion(completion, "")
        controller.close()
      } else {
        // Split by \n and remove empty lines
        // for (const event of decoder.decode(value).split("\n").filter(Boolean)) {
        for (const event of decoder.decode(value).split("data: ").filter(Boolean)) {
          console.log(event)
          const partial_response = JSON.parse(event)
          const output = partial_response.outputs[0]
          if (output?.value) {
            let output_value = ""
            if (output.type === "sql_query") {
              // Wrap SQL query in ```sql
              output_value += output.description
              output_value += "\n"
              output_value += "```sql\n"
              output_value += format(output.value, { language: 'bigquery' })
              output_value += "\n```"
              output_value += "\n"
            // } else if (output.type === "python_code") {
            //   // Wrap Python code in ```python
            //   output_value += output.description
            //   output_value += "\n"
            //   output_value += "```python\n"
            //   output_value += output.value
            //   output_value += "\n```"
            //   output_value += "\n"
            // } else if (["python_output", "string", "int", "float", "bool"].includes(output.type)) {
            //   // Wrap Python and other output types in ```
            //   output_value += "```\n"
            //   output_value += output.value
            //   output_value += "\n```"
            //   output_value += "\n"
            } else if (output.type === "plotly_chart") {
              // Wrap Plotly chart in <plotly_chart></plotly_chart>
              output_value += "<plotly_chart>"
              output_value += output.value
              output_value += "</plotly_chart>"
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
  });

  return new StreamingTextResponse(customStream)
}
