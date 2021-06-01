import fs from 'fs-extra';
import execa from 'execa';

const dirname = 'dist';

await fs.mkdir(dirname, { recursive: true });
await fs.copyFile('LICENSE', `./${dirname}/LICENSE`);
await fs.copyFile('README.md', `./${dirname}/README.md`);

console.log('Building ...');

const { stdout } = await execa('npm', [
  'run',
  'build',
  '--',
  '--outDir',
  `./${dirname}/dist`
]);

console.log(stdout);

await fs.copyFile(
  `packages/vue3-form-validation/package.json`,
  `./${dirname}/package.json`
);
