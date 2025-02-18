import {ApiProperty} from '@nestjs/swagger'
import {Transform} from 'class-transformer'
import {IsArray, IsNumber, IsObject, IsOptional, ValidateNested} from 'class-validator'

export class PaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => parseInt(value as string))
  @IsNumber()
  skip?: number

  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => parseInt(value as string))
  @IsNumber()
  limit?: number

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested({each: true})
  @Transform(({value}) =>
    Object.entries((value as Record<string, string>) || {}).reduce((acc: Record<string, number>, cur) => {
      acc[cur[0]] = parseInt(cur[1])
      return acc
    }, {})
  )
  sort?: Record<string, number>
}
