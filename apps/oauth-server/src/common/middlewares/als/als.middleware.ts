import {NextFunction, Request, RequestHandler, Response} from 'express'
import {AsyncLocalStorage} from 'node:async_hooks'
import * as crypto from 'node:crypto'

export const ASYNC_LOCAL_STORAGE: unique symbol = Symbol()
const TRACING_HEADER = 'x-trace-id'

export interface AsyncStore {
  traceId: string
}

export interface AsyncTracingContext {
  asyncLocalStorage?: AsyncLocalStorage<AsyncStore>
}

export const generateRandomTraceId = () => `${crypto.randomBytes(4).toString('hex')}-${new Date().getTime() / 1000}`

/**
 * @description Wrap the whole asynchronous handlers inside the environment called local storage
 * @tutorial https://docs.nestjs.com/recipes/async-local-storage
 */
export const AsyncLocalStorageMiddleware =
  (als: AsyncTracingContext['asyncLocalStorage']): RequestHandler =>
  (req: Request, _: Response, next: NextFunction): void => {
    if (!als) return next()
    const store = {
      traceId: (req?.headers?.[TRACING_HEADER] as string) || generateRandomTraceId()
    }

    return als.run(store, () => next())
  }
