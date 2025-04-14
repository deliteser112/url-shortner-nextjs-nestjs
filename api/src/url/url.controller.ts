import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UrlService } from './url.service'
import { Response, Request } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUrlDto } from './dto/create-url.dto'
import { Throttle,ThrottlerGuard } from '@nestjs/throttler'

import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard,ThrottlerGuard)
  @Throttle(5, 60)
  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto, @Req() req: Request) {
    const userId = req.user.id
    const result = await this.urlService.shorten(dto.url, userId)

    return {
      slug: result.slug,
      originalUrl: result.originalUrl,
    }
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const result = await this.urlService.resolve(slug)
    res.json({ url: result.originalUrl })
  }

  @Patch('api/urls/:id')
  @UseGuards(JwtAuthGuard)
  async updateSlug(
    @Param('id') id: string,
    @Body() body: { slug: string }
  ) {
    return this.urlService.updateSlug(id, body.slug)
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/urls')
  async getAllByUser(
    @Req() req: Request,
    @Paginate() query: PaginateQuery
  ) {
    const userId = req.user.id;
    return this.urlService.getAllByUser(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/urls/:id')
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const userId = req.user.id;
    await this.urlService.deleteUrl(id, userId);
    return { message: 'URL deleted successfully' };
  }
}
