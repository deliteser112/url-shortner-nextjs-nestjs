import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

import { Url } from './url.entity'
import ShortUniqueId from 'short-unique-id'

@Injectable()
export class UrlService {
  private uid = new ShortUniqueId({ length: 6 }).randomUUID

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>
  ) {}

  private async generateUniqueSlug(): Promise<string> {
    let slug: string
    do {
      slug = this.uid()
    } while (await this.urlRepository.findOneBy({ slug }))
    return slug
  }

  async shorten(originalUrl: string, userId: string): Promise<Url> {
    const slug = await this.generateUniqueSlug()
    const newUrl = this.urlRepository.create({
      slug,
      originalUrl,
      userId,
    })
    return this.urlRepository.save(newUrl)
  }

  async resolve(slug: string): Promise<Url> {
    const url = await this.urlRepository.findOneBy({ slug })
    if (!url) {
      throw new NotFoundException('Short URL not found')
    }

    url.visitCount += 1
    await this.urlRepository.save(url)
    return url
  }

  async updateSlug(id: string, slug: string): Promise<Url> {
    const existingWithSlug = await this.urlRepository.findOneBy({ slug: slug })

    if (existingWithSlug) {
      throw new BadRequestException('Slug already exists')
    }

    const url = await this.urlRepository.findOneBy({ id: parseInt(id) })

    if (!url) {
      throw new NotFoundException('URL not found')
    }

    url.slug = slug
    return this.urlRepository.save(url)
  }

  async getAllByUser(userId: string, query: PaginateQuery): Promise<Paginated<Url>> {
    return paginate(query, this.urlRepository, {
      relations: [],
      where: { userId },
      sortableColumns: ['createdAt', 'slug', 'visitCount'],
      searchableColumns: ['slug', 'originalUrl'], 
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      maxLimit: 100,
    });
  }
  
  async deleteUrl(id: string, userId: string): Promise<void> {
    const numericId = parseInt(id, 10);
  
    const url = await this.urlRepository.findOne({
      where: {
        id: numericId,
        userId,
      },
    });
  
    if (!url) {
      throw new NotFoundException('URL not found or access denied');
    }
  
    await this.urlRepository.remove(url);
  }  
  
}
