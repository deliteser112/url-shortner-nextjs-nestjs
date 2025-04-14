import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Url } from './url.entity';
import type { Paginated } from 'nestjs-paginate';

const mockThrottlerGuard = {
  canActivate: () => true,
};

const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 'mock-user-id' };
    return true;
  },
};

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
  };

  const mockUrls: Url[] = [
    {
      id: 1,
      slug: 'abc123',
      originalUrl: 'https://example.com',
      visitCount: 10,
      createdAt: new Date(),
      userId: 'mock-user-id',
      user: mockUser as any,
    },
  ];

  const mockPaginatedResult: Paginated<Url> = {
    data: mockUrls,
    meta: {
      totalItems: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
      sortBy: [['createdAt', 'DESC']],
      searchBy: [],
      search: '',
    },
    links: {
      first: '/?page=1&limit=10',
      previous: '',
      current: '/?page=1&limit=10',
      next: '',
      last: '/?page=1&limit=10',
    },
  };

  const mockShortenResult = {
    slug: 'shorty123',
    originalUrl: 'https://test.com',
  };

  const urlServiceMock = {
    getAllByUser: jest.fn().mockResolvedValue(mockPaginatedResult),
    shorten: jest.fn().mockResolvedValue(mockShortenResult),
    updateSlug: jest.fn(),
    deleteUrl: jest.fn(),
    resolve: jest.fn().mockResolvedValue(mockUrls[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [{ provide: UrlService, useValue: urlServiceMock }],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockAuthGuard)
      .overrideGuard(ThrottlerGuard).useValue(mockThrottlerGuard)
      .compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });
it('should return paginated urls for the authenticated user', async () => {
  const req: any = { user: { id: 'mock-user-id' } };

  const query = {
    page: 1,
    limit: 10,
    path: '/api/urls',
    sortBy: [['createdAt', 'DESC']],
    search: '',
    searchBy: [],
    filter: {},
  };

  const result = await controller.getAllByUser(req, query as any);

  expect(result).toEqual(mockPaginatedResult);
  expect(service.getAllByUser).toHaveBeenCalledWith(req.user.id, query);
});


  it('should shorten a URL for the authenticated user', async () => {
    const req: any = { user: { id: 'mock-user-id' } };
    const dto = { url: 'https://test.com' };

    const result = await controller.shorten(dto, req);

    expect(result).toEqual(mockShortenResult);
    expect(service.shorten).toHaveBeenCalledWith(dto.url, req.user.id);
  });

  it('should update the slug for a given URL ID', async () => {
    const updatedSlugResult = {
      ...mockUrls[0],
      slug: 'updated-slug',
    };

    urlServiceMock.updateSlug = jest.fn().mockResolvedValue(updatedSlugResult);

    const id = '1';
    const body = { slug: 'updated-slug' };

    const result = await controller.updateSlug(id, body);

    expect(result).toEqual(updatedSlugResult);
    expect(urlServiceMock.updateSlug).toHaveBeenCalledWith(id, body.slug);
  });

  it('should delete a URL for the authenticated user', async () => {
    const req: any = { user: { id: 'mock-user-id' } };
    const id = '1';

    urlServiceMock.deleteUrl = jest.fn().mockResolvedValue(undefined);

    const result = await controller.deleteUrl(id, req);

    expect(result).toEqual({ message: 'URL deleted successfully' });
    expect(urlServiceMock.deleteUrl).toHaveBeenCalledWith(id, req.user.id);
  });

  it('should redirect to the original URL based on slug', async () => {
    const slug = 'abc123';

    const mockRes = {
      json: jest.fn(),
    } as any;

    await controller.redirect(slug, mockRes);

    expect(service.resolve).toHaveBeenCalledWith(slug);
    expect(mockRes.json).toHaveBeenCalledWith({
      url: mockUrls[0].originalUrl,
    });
  });
});
