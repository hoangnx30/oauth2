import {HttpStatus, Type, applyDecorators} from '@nestjs/common'
import {ApiExtraModels, ApiOkResponse, ApiResponse, getSchemaPath} from '@nestjs/swagger'
import {ReferenceObject, SchemaObject} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import {BaseApiResponse, PaginatedApiResponseDto} from '../dtos/response.dto'

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedApiResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {$ref: getSchemaPath(PaginatedApiResponseDto)},
          {
            properties: {
              data: {
                type: 'array',
                items: {$ref: getSchemaPath(model)}
              }
            }
          }
        ]
      }
    })
  )
}

export const ApiOkeResponse = <TModel extends Type<unknown>>({
  model,
  isArray,
  status,
  description
}: {
  model?: TModel
  isArray?: boolean
  status?: HttpStatus
  description?: string
}) => {
  status = status || HttpStatus.OK
  if (model) {
    const modelSchemaPath = getSchemaPath(model)

    const properties: Record<string, SchemaObject | ReferenceObject> = {
      data: {}
    }

    if (isArray) {
      ;(properties.data as SchemaObject).type = 'array'
      ;(properties.data as SchemaObject).items = {$ref: modelSchemaPath}
    } else {
      ;(properties.data as ReferenceObject).$ref = modelSchemaPath
    }

    return applyDecorators(
      ApiExtraModels(BaseApiResponse, model),
      ApiResponse({
        description: description ?? 'Success',
        status: status,
        schema: {
          allOf: [
            {$ref: getSchemaPath(BaseApiResponse)},
            {
              properties
            }
          ]
        }
      })
    )
  }

  return applyDecorators(ApiExtraModels(BaseApiResponse), ApiResponse({type: BaseApiResponse, status}))
}
