import {ApiProperty} from '@nestjs/swagger'
import {Exclude, Expose} from 'class-transformer'
import {IsNotEmpty, IsOptional, IsString, IsUrl} from 'class-validator'

@Exclude()
export class AuthorizationRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  clientId: string

  @ApiProperty()
  @Expose()
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  redirectUri: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  codeChallenge: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  codeChallengeMethod: string

  @ApiProperty({required: false})
  @Expose()
  @IsOptional()
  @IsString()
  state?: string

  @ApiProperty({required: false})
  @Expose()
  @IsOptional()
  @IsString()
  scope?: string
}

export class AuthorizationResDto {
  @ApiProperty()
  redirectUrl: string
}
