const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    setupFiles: ['./tests/setup/test-setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'controllers/**/*.js',
        'middlewares/**/*.js',
        'routes/**/*.js',
        'services/**/*.js',
        'utils/**/*.js',
        'app.js'
      ],
      exclude: ['tests/**', 'config/**']
    }
  }
});
