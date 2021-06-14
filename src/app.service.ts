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
   *
   * @return {any} page's metadata - translations and scripts names
   */
  getMetadata = (page: string): any =>
    Object.assign({}, this._i18n[page], {
      scripts: {
        esm: metadata.esm[page],
        system: metadata.system[page],
      },
      global: {
        esm: metadata.esm.global,
        system: metadata.system.global,
      },
    });

  /**
   * Returns the query string prefixed by ? or an empty string
   *
   * @param {any} queryObject - object with key/value pair to build the final query string
   *
   * @return {string} the query string prefixed by ? or an empty string
   */
  buildQueryString = (queryObject: any): string =>
    !!Object.keys(queryObject).length
      ? [
          '?',
          Object.keys(queryObject)
            .reduce(
              (acc, curr) => acc.concat(`${curr}=${queryObject[curr]}`),
              [],
            )
            .join('&'),
        ].join('')
      : '';
}
