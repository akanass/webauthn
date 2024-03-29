import { Plugin, RollupOptions } from 'rollup';

// rollup plugins
import * as typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import * as styles from 'rollup-plugin-styles';
import * as del from 'rollup-plugin-delete';

// custom plugins
import { cleanComments, metadata } from './rollup.plugin';

// libraries to extract YAML config
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

// list of available plugins during build process
const plugins = {
  typescript,
  nodeResolve,
  terser,
  styles,
  del,
  cleanComments,
  metadata,
};

// rollup config from YAML file
const rc: RollupOptions[] = yaml.load(
  fs.readFileSync('./rollup.config.yml', 'utf8'),
);

// rebuild config array to switch plugins values from config by plugins functions
const config: RollupOptions[] = rc.map((_: RollupOptions) =>
  Object.assign({}, _, {
    plugins: []
      // check if we have declared plugins in config file
      .concat(!!_.plugins ? _.plugins : [])
      // check if plugin is imported and declared inside plugins functions list
      .filter((plugin: Plugin) => !!plugins[plugin.name])
      // switch config value to function
      .map((plugin: Plugin) =>
        plugins[plugin.name](Object.assign({}, plugin.api)),
      ),
  }),
);

export default config;
