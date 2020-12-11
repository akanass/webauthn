import { Injectable } from '@nestjs/common';
import * as Config from 'config';
import * as metadata from './metadata.json';

@Injectable()
export class AppService {
  // private property to store all translations
  private readonly _i18n: any;

  /**
   * Service constructor
   */
  constructor() {
    // store all translations
    this._i18n = Config.get<any>('views.i18n');
  }

  /**
   * Returns page's metadata - translations and scripts names
   *
   * @param {string} page - current rendered page
   */
  getMetadata(page: string): any {
    return Object.assign({}, this._i18n[page], {
      script: {
        es: metadata.es[page],
        system: metadata.system[page]
      }
    });
  }
}
