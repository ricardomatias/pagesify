import esbuild from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    platform: 'node',
    target: 'esnext',
    sourcemap: true,
    external: Object.keys(pkg.dependencies || {}),
    minify: false,
});

console.log('Build completed successfully!');
