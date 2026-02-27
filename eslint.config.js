const nxPlugin = require('@nx/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@nx': nxPlugin,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        // TODO: Elevate to 'error' once code is fully moved into libs (circular deps will disappear)
        'warn',
        {
          enforceBuildableLibDependency: false,
          allowCircularSelfDependency: true,
          allow: [
            // Allow barrel re-exports from libs/ back to src/ (stepping-stone pattern)
            // TODO: Remove once code is fully moved into libs
            '^\\.\\./.*src/',
          ],
          depConstraints: [
            // ── shared: no imports outside scope:shared ──
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            // ── core: may use shared ──
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:core'],
            },
            // ── game-engine: may use shared ──
            {
              sourceTag: 'scope:game-engine',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:game-engine'],
            },
            // ── features: may use shared, core, game-engine — NOT other features ──
            {
              sourceTag: 'scope:feature',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:core',
                'scope:game-engine',
                'scope:feature',
              ],
            },
          ],
        },
      ],
    },
  },
];
