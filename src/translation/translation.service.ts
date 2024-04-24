import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

const DEFAULT_TEMPERATURE = 0;
const DEFAULT_MODEL = 'gpt-3.5-turbo-instruct'; // use any modal who support /v1/completions

@Injectable()
export class TranslationService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is loaded from environment variables
    });
    this.openai = new OpenAIApi(configuration);
  }

  convertToJson(inputString: string): any {
    try {
      // Correct the string by ensuring proper JSON formatting
      const correctedString = inputString
        .replace(/(\w+)(?=:)/g, '"$1"')
        .replace(/'/g, '"');

      // Parse the corrected string into a JSON object
      return JSON.parse(correctedString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  async validateTranslation(
    originalText: string,
    translatedText: string,
    originalLang: string,
    translatedLang: string,
  ): Promise<string> {
    try {
      const prompt = `Original (${originalLang}): ${originalText}\nTranslated (${translatedLang}): ${translatedText}\nEvaluate accuracy and respond in JSON format: {valid: true/false, correct: 'if incorrect, provide correct translation of Original'}`;
      const response = await this.openai.createCompletion({
        model: DEFAULT_MODEL,
        prompt,
        max_tokens: 60,
        temperature: DEFAULT_TEMPERATURE,
      });

      const text = response.data.choices[0].text.trim();
      return this.convertToJson(text);
    } catch (error) {
      console.error('Error validating translation:', error);
      throw new Error('Failed to validate translation.');
    }
  }

  async translate(
    originalText: string,
    translatedLang: string,
  ): Promise<any> {
    try {
      const prompt = `Translate  to ${translatedLang}: ${originalText}`;
      const response = await this.openai.createCompletion({
        model: DEFAULT_MODEL,
        prompt,
        max_tokens: 60,
        temperature: DEFAULT_TEMPERATURE,
      });

      const translated = response.data.choices[0].text.trim();
      return { translated };
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate.');
    }
  }
}
