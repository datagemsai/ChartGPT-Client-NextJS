import config from '@/lib/config'
import { kv as defaultKv, createClient } from '@vercel/kv'

const kv = (config.kvRestApiUrl && config.kvRestApiToken) ? createClient({
  url: config.kvRestApiUrl,
  token: config.kvRestApiToken,
}) : defaultKv

export {
  kv,
}
