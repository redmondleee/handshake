require('esbuild').build({
  entryPoints: ['./src/create-student-handler.ts', './src/list-students-handler.ts'],
  bundle: true,
  outdir: './dist',
  platform: 'node',
  target: 'esnext',
  sourcemap: true,
  logLevel: 'info',
  external: ['aws-sdk'],
}).catch(() => process.exit(1));
