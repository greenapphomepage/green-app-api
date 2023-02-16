import { Injectable } from '@nestjs/common';
import { Seeder } from '../../global/type/seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';
import { programmingLanguage } from '../../entities/programmingLanguage';
import { Command } from 'nestjs-command';
import { Features } from '../../entities/feature';

@Injectable()
export class FeatureSeed implements Seeder {
  constructor(
    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,
  ) {}
  @Command({
    command: 'create:feature',
    describe: 'create feature',
  })
  async up() {
    const data = [
      {
        featureKey: 'sign-in-screen',
        featureName: 'Sign in',
        extra: ['Basic (ID_PASSWORD)', 'Social', 'Phone Number'],
      },
      {
        featureKey: 'register-screen',
        featureName: 'Register',
        extra: ['Basic (ID_PASSWORD)', 'Social', 'Phone Number'],
      },
      {
        featureKey: 'profile-page',
        featureName: 'Profile page',
        extra: ['Avatar', 'Email', 'Phone Number'],
      },
    ];
    const newArr = data.map((item) => {
      return {
        featureKey: item.featureKey,
        featureName: item.featureName,
        extra: JSON.stringify(item.extra),
      };
    });
    const input = this.featureRepo.create(newArr);
    await this.featureRepo.save(input);
  }

  @Command({
    command: 'seed:remove-feature',
    describe: 'remove feature',
  })
  async down() {
    console.log(`Removed feature`);
    return this.featureRepo.clear();
  }
}
