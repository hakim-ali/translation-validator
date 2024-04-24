import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { Express } from 'express';

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

  @Post('/upload-validate')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndValidateFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const buffer =
        await this.translationService.processAndValidateTranslations(
          file.buffer,
        );

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="validated_translations.xlsx"',
      );
      return res.send(buffer);
    } catch (error) {
      throw new HttpException(
        'Failed to process file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
