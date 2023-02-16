import { Injectable } from '@nestjs/common';
import { Seeder } from '../../global/type/seeder';
import { Command } from 'nestjs-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { programmingLanguage } from '../../entities/programmingLanguage';

@Injectable()
export class LanguageSeed implements Seeder {
  constructor(
    @InjectRepository(programmingLanguage)
    private readonly repository: Repository<programmingLanguage>,
  ) {}
  @Command({
    command: 'create:language',
    describe: 'create language',
  })
  async up() {
    const data = [
      {
        key: 'Javascript',
        name: 'Javascript',
      },
      {
        key: 'Typescript',
        name: 'Typescript',
      },
      {
        key: 'Java',
        name: 'Java',
      },
      {
        key: 'Python',
        name: 'Python',
      },
      {
        key: 'C#',
        name: 'C#',
      },
      {
        key: 'PHP',
        name: 'PHP',
      },
      {
        key: 'Rust',
        name: 'Rust',
      },
      {
        key: 'C',
        name: 'C',
      },
      {
        key: 'C++',
        name: 'C++',
      },
      {
        key: 'Kotlin',
        name: 'Kotlin',
      },
      {
        key: 'Dart',
        name: 'Dart',
      },
      {
        key: 'Go',
        name: 'Go',
      },
      {
        key: 'Ruby',
        name: 'Ruby',
      },
    ];
    await this.repository.insert(data);
  }

  @Command({
    command: 'seed:remove-language',
    describe: 'remove language',
  })
  async down() {
    console.log(`Removed language`);
    return this.repository.clear();
  }
}
