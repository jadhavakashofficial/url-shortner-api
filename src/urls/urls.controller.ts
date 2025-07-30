import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Redirect,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { UrlStatsDto } from './dto/url-stats.dto';

@ApiTags('URL Shortener')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('api/shorten')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({
    status: 201,
    description: 'URL successfully shortened',
    type: UrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format',
  })
  @ApiResponse({
    status: 409,
    description: 'Custom code already in use',
  })
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<UrlResponseDto> {
    return this.urlsService.createShortUrl(createUrlDto);
  }

  @Get('r/:shortCode')
  @Redirect()
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiParam({
    name: 'shortCode',
    description: 'The short code to redirect',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async redirectToUrl(@Param('shortCode') shortCode: string) {
    const url = await this.urlsService.findByShortCode(shortCode);
    await this.urlsService.incrementClicks(shortCode);

    return {
      url: url.originalUrl,
      statusCode: HttpStatus.FOUND,
    };
  }

  @Get('api/stats/:shortCode')
  @ApiOperation({ summary: 'Get URL statistics' })
  @ApiParam({
    name: 'shortCode',
    description: 'The short code to get statistics for',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'URL statistics retrieved successfully',
    type: UrlStatsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async getUrlStats(
    @Param('shortCode') shortCode: string,
  ): Promise<UrlStatsDto> {
    return this.urlsService.getUrlStats(shortCode);
  }
}
