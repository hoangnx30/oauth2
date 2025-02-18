import {ApiProperty} from '@nestjs/swagger'

export class PaginatedResponse<T> {
  data: T
  totalItems: number

  constructor(data: T, totalItems: number) {
    this.data = data
    this.totalItems = totalItems
  }
}

export class MetaDto {
  @ApiProperty({example: 100})
  total: number

  @ApiProperty({example: 10})
  itemCount: number

  @ApiProperty({example: 10})
  itemsPerPage: number

  @ApiProperty({example: 1})
  currentPage: number

  @ApiProperty({example: 10})
  totalPages: number

  @ApiProperty({example: true})
  hasNextPage: boolean

  @ApiProperty({example: false})
  hasPrevPage: boolean

  constructor(total: number, limit: number, currentPage: number, itemCount: number) {
    this.total = total
    this.itemCount = itemCount
    this.itemsPerPage = limit
    this.currentPage = currentPage
    this.totalPages = Math.ceil(total / limit)
    this.hasNextPage = currentPage < this.totalPages
    this.hasPrevPage = currentPage > 1
  }
}

export class BaseApiResponse<T> {
  @ApiProperty({type: Boolean, example: true})
  success = true

  data: T

  @ApiProperty({example: new Date().toISOString()})
  timestamp: string

  constructor(data: T) {
    this.data = data
    this.timestamp = new Date().toISOString()
  }
}

export class PaginatedApiResponseDto<T> extends BaseApiResponse<T> {
  @ApiProperty({type: MetaDto}) ƒ
  meta: MetaDto

  constructor(data: T, meta: MetaDto) {
    super(data)
    this.meta = meta
  }
}
