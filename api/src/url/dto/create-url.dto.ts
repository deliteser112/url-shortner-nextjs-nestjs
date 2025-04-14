import { IsString, IsUrl } from 'class-validator'

export class CreateUrlDto {
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL (e.g. https://example.com)' })
  url: string
}
