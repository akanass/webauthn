import { NormalizedOutputOptions, OutputAsset, OutputBundle, OutputChunk, Plugin } from 'rollup';
import { from, merge, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import * as fs from 'fs-extra';
import * as deepmerge from 'deepmerge';
import { join } from 'path';

const metadata: Plugin = (opts: Options) => {
  const destination: string = join(__dirname, !!opts.destination ? opts.destination : 'src/metadata.json');
  return {
    name: 'metadata',
    writeBundle: async (options: NormalizedOutputOptions, bundle: OutputBundle) => {
      await from(Object.values(bundle))
        .pipe(
          filter((_: OutputAsset | OutputChunk) => 'isEntry' in _ ? !!_.isEntry && !_.exports.length : true),
          map((_: OutputAsset | OutputChunk) => _.fileName),
          map((_: string) => _.split('-')),
          map((_: string[]) => ({ parts: _, types: _[ 0 ].split('/') })),
          map((_: { parts: string[], types: string[] }) =>
            _.types.length === 2 ?
              ({ [ _.types[ 0 ] ]: { [ _.types[ 1 ] ]: [ _.types[ 1 ], _.parts[ 1 ] ].join('-') } }) :
              ({ [ _.types[ 0 ] ]: [ _.types[ 0 ], _.parts[ 1 ] ].join('-') }),
          ),
          map((meta: any) =>
            ({
              meta,
              jsonExists: from(fs.pathExists(destination)),
            }),
          ),
          mergeMap((_: { meta: any, jsonExists: Observable<boolean> }) =>
            merge(
              _.jsonExists
                .pipe(
                  filter((jsonExists: boolean) => !!jsonExists),
                  mergeMap(() => from(fs.readJson(destination))),
                  map(json => deepmerge(json, _.meta)),
                  mergeMap(json => from(fs.outputJson(destination, json))),
                ),
              _.jsonExists
                .pipe(
                  filter((jsonExists: boolean) => !jsonExists),
                  mergeMap(() => from(fs.outputJson(destination, _.meta))),
                ),
            ),
          ),
        ).toPromise();
    },
  };
};

export { metadata };

export interface Options {
  destination: string;
}
