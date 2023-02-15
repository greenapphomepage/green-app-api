import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';

@Injectable()
export class PreviewService {
  constructor(
    @InjectRepository(Previews)
    private readonly previewRepository: Repository<Previews>,
  ) {}
  async get() {
    return await this.previewRepository.findOne({ where: { key: 'preview' } });
  }
}
