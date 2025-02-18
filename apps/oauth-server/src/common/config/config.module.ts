import {DynamicModule, Global, Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {ClassConstructor, plainToClass} from 'class-transformer'
import {validateSync} from 'class-validator'
import {readFileSync} from 'fs'
import * as YAML from 'js-yaml'
import {join} from 'path'

const YAML_CONFIG_FILENAME = 'config.yaml'
type ConfigOptions = {
  configPath?: string
  class: ClassConstructor<object>
}

@Global()
@Module({})
export class CustomConfigModule {
  public static register(options: ConfigOptions): DynamicModule {
    return {
      module: CustomConfigModule,
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => this.validate(options.class, this.load(options.configPath))]
        })
      ],
      providers: [ConfigService],
      exports: [ConfigService]
    }
  }

  private static load(configPath = './config.yaml') {
    return YAML.load(readFileSync(join(process.cwd(), configPath), 'utf-8')) as Record<any, any>
  }

  private static validate<T extends object>(klass: ClassConstructor<T>, config: T) {
    const validatedConfig = plainToClass(klass, config, {enableImplicitConversion: true})
    const errors = validateSync(validatedConfig, {skipMissingProperties: false})
    if (errors.length > 0) throw new Error(errors.toString())
    return validatedConfig
  }
}
