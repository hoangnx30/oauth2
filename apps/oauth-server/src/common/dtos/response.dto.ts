import {ApiProperty} from '@nestjs/swagger'

export class PaginatedResponseDto<T> {
  @ApiProperty({example: 20})
  total: number

  @ApiProperty({example: 0})
  skip: number

  @ApiProperty({example: 10})
  limit: number

  data: T[]

  @ApiProperty({example: 'success'})
  message: string

  constructor(total: number, skip: number, limit: number, data: T[]) {
    this.total = total
    this.skip = skip
    this.data = data
    this.limit = limit
  }
}

export class ResponseDto<T> {
  data: T[]

  @ApiProperty({example: 'success'})
  message: string
}
