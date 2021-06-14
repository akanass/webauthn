import {
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  OutputChunk,
  Plugin,
} from 'rollup';
import { from, lastValueFrom, of } from 'rxjs';
import { defaultIfEmpty, filter, map, mergeMap, tap } from 'rxjs/operators';
import * as fs from 'fs-extra';
import * as deepmerge from 'deepmerge';
import { join } from 'path';

const metadata: Plugin = () => {
  return {
    name: 'metadata',
    writeBundle: async (
      options: NormalizedOutputOptions,
      bundle: OutputBundle,
    ) => {
      const destination: string = join(__dirname, 'src/metadata.json');
      await lastValueFrom(
        from(Object.values(bundle)).pipe(
          filter((_: OutputAsset | OutputChunk) =>
            'isEntry' in _ ? !!_.isEntry && !_.exports.length : true,
          ),
          map((_: OutputAsset | OutputChunk) => _.fileName),
          map((_: string) => _.split('-')),
          map((_: string[]) => ({ parts: _, types: _[0].split('/') })),
          map((_: { parts: string[]; types: string[] }) =>
            _.types.length === 2
              ? {
                  [_.types[0]]: {
                    [_.types[1]]: [_.types[1], _.parts[1]].join('-'),
                  },
                }
              : { [_.types[0]]: [_.types[0], _.parts[1]].join('-') },
          ),
          map((meta: any) => ({
            meta,
            jsonExists: fs.pathExistsSync(destination),
          })),
          map((_: { meta: any; jsonExists: boolean }) =>
            _.jsonExists
              ? deepmerge(fs.readJsonSync(destination), _.meta)
              : _.meta,
          ),
          tap((_) => fs.outputJsonSync(destination, _)),
        ),
      );
    },
  };
};

const cleanComments: Plugin = () => {
  return {
    name: 'cleanComments',
    renderChunk: async (code: string, chunk: any) => {
      return await lastValueFrom(
        of(chunk.fileName).pipe(
          filter((name: string) => name.indexOf('_webauthn') === -1),
          mergeMap(() =>
            of(code).pipe(
              map((_: string) =>
                _.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, ''),
              ),
              map((_: string) => _.replace(/\n/gm, '')),
            ),
          ),
          defaultIfEmpty(code),
        ),
      );
    },
  };
};

export { metadata, cleanComments };
