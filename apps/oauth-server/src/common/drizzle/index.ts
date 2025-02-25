import type {BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations} from 'drizzle-orm'

import * as schema from '../entities'

type Schema = typeof schema
type TSchema = ExtractTablesWithRelations<Schema>

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with']

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With
  }
>

export * from './database.module'
export * from './unit-of-work.service'
