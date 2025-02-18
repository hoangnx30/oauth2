import {defineConfig} from 'drizzle-kit'
import {readFileSync} from 'fs'
import YAML from 'js-yaml'
import {join} from 'path'
import {DB_SCHEMA} from 'src/common/entities/base.entity'
import {Env} from 'src/common/env'

const loadEnv = () => {
  const configPath = join(process.cwd(), 'config.yaml')
  let config = YAML.load(readFileSync(configPath, 'utf-8'))

  return config as Env
}

const env = loadEnv()

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/entities/*',
  out: './drizzle',

  dbCredentials: {
    user: env.database.postgres.user,
    host: env.database.postgres.host,
    port: env.database.postgres.port,
    password: env.database.postgres.password,
    database: env.database.postgres.database,
    ssl: false
  },

  migrations: {
    table: 'drizzle_migration',
    prefix: 'timestamp'
  },

  breakpoints: true,
  strict: true,
  verbose: true
})
