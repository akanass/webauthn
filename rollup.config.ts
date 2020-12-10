import { RollupOptions } from 'rollup';
import * as typescript from '@rollup/plugin-typescript';
import * as commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import * as json from '@rollup/plugin-json';
import * as styles from 'rollup-plugin-styles';
import * as del from 'rollup-plugin-delete';
import * as Config from 'config';

const rc = Config.get('rollup');

const config: RollupOptions[] = [
  {
    input: rc.app.input,
    output: rc.app.output,
    plugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      del(Object.assign({}, rc.options.clear.js)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typescript(Object.assign({}, rc.options.typescript)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      commonjs(),
      nodeResolve(Object.assign({}, rc.options.nodeResolve)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      json(),
      terser(),
    ],
  },
  {
    input: rc.vendor.input,
    output: rc.vendor.output,
    plugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      commonjs(),
      nodeResolve(Object.assign({}, rc.options.nodeResolve)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      json(),
      terser(),
    ],
  },
  {
    input: rc.scss.input,
    output: rc.scss.output,
    plugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      del(Object.assign({}, rc.options.clear.css.before)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      styles(Object.assign({}, rc.options.scss)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      del(Object.assign({}, rc.options.clear.css.after)),
    ],
  },
];

export default config;
