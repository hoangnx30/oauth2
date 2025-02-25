import {DrizzlePGModule} from '@knaadh/nestjs-drizzle-pg'
import {Global, Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

import {CustomConfigModule} from '../config'
import {DATABASE_TOKEN} from '../constants/app.constants'
import * as schema from '../entities'
import {UnitOfWorkService} from './unit-of-work.service'

@Global()
@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      tag: DATABASE_TOKEN,
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database.postgres')
        const {user, password, port, database, host} = databaseConfig
        return {
          pg: {config: {user, password, port, database, host}, connection: 'pool'},
          config: {schema: schema, logger: true}
        }
      },
      inject: [ConfigService],
      imports: [CustomConfigModule]
    })
  ],
  providers: [UnitOfWorkService],
  exports: [UnitOfWorkService]
})
export class DatabaseModule {}
