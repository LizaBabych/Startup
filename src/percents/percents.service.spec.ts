import { Test, TestingModule } from '@nestjs/testing';
import { PercentsService } from './percents.service';

describe('PercentsService', () => {
  let service: PercentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PercentsService],
    }).compile();

    service = module.get<PercentsService>(PercentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
