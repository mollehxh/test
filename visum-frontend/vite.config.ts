import react from '@vitejs/plugin-react';
import path from 'path';
import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({ extensions: ['.ts', '.tsx'], babelHelpers: 'bundled' }),
    react({ fastRefresh: false }),
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve('src'),
      },
    ],
  },
});
