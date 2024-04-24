import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [ConfigModule.forRoot(), TranslationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
