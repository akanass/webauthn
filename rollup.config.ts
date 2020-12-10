import { RollupOptions, Plugin } from 'rollup';
import * as typescript from '@rollup/plugin-typescript';
import * as commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import * as json from '@rollup/plugin-json';
import * as styles from 'rollup-plugin-styles';
import * as del from 'rollup-plugin-delete';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

// list of available plugins during build process
const plugins = { typescript, commonjs, nodeResolve, terser, json, styles, del };

// rollup config from YAML file
const rc: RollupOptions[] = yaml.safeLoad(fs.readFileSync('./rollup.config.yml', 'utf8'));

// rebuild config array to switch plugins values from config by plugins functions
const config: RollupOptions[] = rc.map((_: RollupOptions) =>
  Object.assign({}, _, {
    plugins: []
      // check if we have declared plugins in config file
      .concat(!!_.plugins ? _.plugins : [])
      // check if plugin is imported and declared inside plugins functions list
      .filter((plugin: Plugin) => !!plugins[plugin.name])
      // switch config value to function
      .map((plugin: Plugin) => plugins[plugin.name](Object.assign({}, plugin.api)))
  })
);

export default config;
