import {ApiProperty} from '@nestjs/swagger'
import {ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, IsUrl, Matches} from 'class-validator'

export class CreateOAuthClientDto {
  @ApiProperty({description: 'Name of the OAuth client'})
  @IsString()
  @Matches(/^[a-zA-Z0-9-_\s]{3,50}$/, {
    message:
      'Client name must be between 3 and 50 characters and can only contain letters, numbers, spaces, hyphens, and underscores'
  })
  clientName: string

  @ApiProperty({description: 'URI of the client application'})
  @IsUrl({}, {message: 'Client URI must be a valid URL'})
  clientUri: string

  @ApiProperty({description: 'Redirect URIs for OAuth callbacks', type: [String]})
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, {each: true, message: 'Each redirect URI must be a valid URL'})
  redirectUris: string[]

  @ApiProperty({description: 'Space-separated OAuth scopes', required: false})
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9.:_\s]*$/, {
    message: 'Scopes must only contain letters, numbers, dots, colons, underscores, and spaces'
  })
  scope?: string

  @ApiProperty({description: 'Whether this is a confidential client'})
  @IsBoolean()
  isConfidential: boolean
}
