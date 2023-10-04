import { Config } from '@/lib/types'

const config = require(`@/lib/config/${process.env.NEXT_PUBLIC_CONFIG ?? 'default'}`).default

export default config as Config