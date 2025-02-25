import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'

export abstract class BaseRepository {
  protected constructor(
    private readonly drizzle: NodePgDatabase<typeof schema>,
    private readonly unitOfWorkService: UnitOfWorkService
  ) {}

  protected getDatabase(): NodePgDatabase<typeof schema> {
    try {
      return this.unitOfWorkService.getTransaction()
    } catch (error) {
      console.error(error)
      return this.drizzle
    }
  }
}
