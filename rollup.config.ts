import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import cleaner from 'rollup-plugin-cleaner';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    cleaner({
      targets: ['./lib/'],
    }),
  ],
};
