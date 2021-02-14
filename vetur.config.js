module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
    'vetur.validation.style': false
  },
  projects: [
    {
      root: './vite',
      tsconfig: './tsconfig.json'
    }
  ]
};
