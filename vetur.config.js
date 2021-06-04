module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true
  },
  projects: [
    {
      root: './packages/vue-test-app',
      package: './package.json',
      tsconfig: './tsconfig.json'
    }
  ]
};
