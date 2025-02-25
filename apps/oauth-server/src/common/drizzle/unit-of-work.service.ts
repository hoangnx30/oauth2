import {Inject, Injectable, Logger} from '@nestjs/common'
import {ExtractTablesWithRelations} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'
import {PgDatabase} from 'drizzle-orm/pg-core'

import * as schema from '@/common/entities'

import {DATABASE_TOKEN} from '../constants/app.constants'

interface ITransactionProvider {
  getTransaction(): PgDatabase<any, typeof schema, ExtractTablesWithRelations<typeof schema>>
}

@Injectable()
export class UnitOfWorkService implements ITransactionProvider {
  private transaction: PgDatabase<any, typeof schema, ExtractTablesWithRelations<typeof schema>> | null = null
  private readonly logger = new Logger(UnitOfWorkService.name)

  constructor(@Inject(DATABASE_TOKEN) private readonly drizzle: NodePgDatabase<typeof schema>) {}

  getTransaction(): NodePgDatabase<typeof schema> {
    if (!this.transaction) {
      throw new Error('Transaction not started')
    }
    return this.transaction
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return await this.drizzle.transaction(async (tx) => {
      this.transaction = tx
      try {
        const result = await operation()
        return result
      } catch (error) {
        this.logger.error(error)
        throw new Error('Transaction failed')
      } finally {
        this.transaction = null
      }
    })
  }
}
