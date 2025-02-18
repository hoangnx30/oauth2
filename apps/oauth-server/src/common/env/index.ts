import {Type} from 'class-transformer'
import {IsNotEmpty, IsNumber, IsString, ValidateNested} from 'class-validator'

class Server {
  @IsNumber()
  @IsNotEmpty()
  port: number
}

class Postgres {
  @IsString()
  @IsNotEmpty()
  host: string

  @IsNumber()
  @IsNotEmpty()
  port: number

  @IsString()
  @IsNotEmpty()
  user: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  database: string
}

class Database {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Postgres)
  postgres: Postgres
}

class Jwt {
  @IsNotEmpty()
  @IsString()
  secret: string

  @IsNotEmpty()
  @IsNumber()
  expiration: number
}

export class Env {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Server)
  server: Server

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Database)
  database: Database

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Jwt)
  jwt: Jwt
}
