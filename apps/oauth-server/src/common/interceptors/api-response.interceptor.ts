import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common'
import {Observable, map} from 'rxjs'

import {BaseApiResponse, MetaDto, PaginatedApiResponseDto} from '../dtos'

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const {page = 1, limit = 10} = request.query

    return next.handle().pipe(
      map((response) => {
        // If the response is already formatted, return as is
        if (response?.success !== undefined) {
          return response
        }

        // Handle paginated responses
        if (response?.data && response?.totalItems !== undefined) {
          const totalItems = response.totalItems
          const data = response.data

          const meta = new MetaDto(totalItems, limit, page, data.length)
          return new PaginatedApiResponseDto(data, meta)
        }

        // Handle non-paginated responses
        return new BaseApiResponse(response)
      })
    )
  }
}
