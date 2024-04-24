import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TranslationService } from './translation.service';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('/validate')
  async getValidation(
    @Query('original') originalText: string,
    @Query('originalLang') originalLang: string,
    @Query('translated') translatedText: string,
    @Query('translatedLang') translatedLang: string,
  ): Promise<string> {
    if (!originalText || !translatedText || !originalLang || !translatedLang) {
      throw new HttpException(
        'Missing parameters: All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.translationService.validateTranslation(
      originalText,
      translatedText,
      originalLang,
      translatedLang,
    );
  }

  @Get('/translate')
  async getTranslate(
    @Query('original') originalText: string,
    @Query('translatedLang') translatedLang: string,
  ): Promise<string> {
    if (!originalText || !translatedLang) {
      throw new HttpException(
        'Missing parameters: All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.translationService.translate(
      originalText,

      translatedLang,
    );
  }
}
