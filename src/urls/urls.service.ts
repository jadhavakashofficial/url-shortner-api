import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { UrlStatsDto } from './dto/url-stats.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<UrlDocument>,
    private configService: ConfigService,
  ) {}

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const { url, customCode } = createUrlDto;

    let shortCode: string;

    if (customCode) {
      const existingUrl = await this.urlModel.findOne({
        shortCode: customCode,
      });
      if (existingUrl) {
        throw new ConflictException('Custom code is already in use');
      }
      shortCode = customCode;
    } else {
      shortCode = await this.generateUniqueShortCode();
    }

    const newUrl = new this.urlModel({
      originalUrl: url,
      shortCode,
    });

    await newUrl.save();

    const baseUrl = this.getBaseUrl();
    return {
      originalUrl: url,
      shortUrl: `${baseUrl}/r/${shortCode}`,
    };
  }

  async findByShortCode(shortCode: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.urlModel.updateOne({ shortCode }, { $inc: { clicks: 1 } });
  }

  async getUrlStats(shortCode: string): Promise<UrlStatsDto> {
    const url = await this.findByShortCode(shortCode);
    const baseUrl = this.getBaseUrl();

    return {
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      clicks: url.clicks,
    };
  }

  private async generateUniqueShortCode(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    let isUnique = false;

    while (!isUnique) {
      shortCode = '';
      for (let i = 0; i < 6; i++) {
        shortCode += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      const existingUrl = await this.urlModel.findOne({ shortCode });
      if (!existingUrl) {
        isUnique = true;
      }
    }

    return shortCode;
  }

  private getBaseUrl(): string {
    // Check if we have a custom base URL (for production/Vercel)
    const customBaseUrl = this.configService.get<string>('BASE_URL');
    if (customBaseUrl) {
      return customBaseUrl;
    }
    
    // Default to localhost for development
    const port = this.configService.get<number>('PORT', 3000);
    return `http://localhost:${port}`;
  }
}
