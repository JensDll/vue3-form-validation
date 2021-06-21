import fs from 'fs-extra';
import execa from 'execa';

async function lintCheck() {
  const { stdout } = await execa('npm', ['run', 'lint-check']);

  return stdout;
}

async function build(dirname) {
  const { stdout } = await execa('npm', [
    'exec',
    '--',
    'tsc',
    '--project',
    './packages/vue3-form-validation',
    '--outDir',
    `./${dirname}/dist`
  ]);
  
  return stdout;
}

const dirname = 'dist';

await fs.mkdir(dirname, { recursive: true });
await fs.copyFile('LICENSE', `./${dirname}/LICENSE`);
await fs.copyFile('README.md', `./${dirname}/README.md`);

console.log('Checking files ...');
console.log(await lintCheck());

console.log('Building ...');
console.log(await build(dirname));

await fs.copyFile(
  `packages/vue3-form-validation/package.json`,
  `./${dirname}/package.json`
);

console.log('Done');
