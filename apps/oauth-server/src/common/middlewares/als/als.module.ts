import {Global, Module} from '@nestjs/common'
import {AsyncLocalStorage} from 'async_hooks'

import {ASYNC_LOCAL_STORAGE, AsyncStore} from './als.middleware'

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: ASYNC_LOCAL_STORAGE,
      useValue: new AsyncLocalStorage<AsyncStore>()
    }
  ],
  exports: [ASYNC_LOCAL_STORAGE]
})
export class AlsModule {}
