import type { JestConfigWithTsJest } from 'ts-jest'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules'],
}

export default jestConfig