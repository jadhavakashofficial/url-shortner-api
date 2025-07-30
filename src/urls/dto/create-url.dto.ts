import { IsUrl, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/a-very-long-url-to-shorten',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  url: string;

  @ApiPropertyOptional({
    description: 'Custom short code (optional)',
    example: 'my-custom-link',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Custom code can only contain letters, numbers, hyphens, and underscores',
  })
  customCode?: string;
}
