import { ApiProperty } from '@nestjs/swagger';

export class UrlStatsDto {
  @ApiProperty({
    description: 'The original URL',
    example: 'https://www.example.com/a-very-long-url-to-shorten',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'The shortened URL',
    example: 'http://localhost:3000/r/abc123',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'Number of times the short URL has been accessed',
    example: 15,
  })
  clicks: number;
}
