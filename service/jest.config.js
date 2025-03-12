const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: '@shelf/jest-dynamodb',
  transform: {
    ...tsjPreset.transform,
  },
  testMatch: ['**/__tests__/**/[^.]+.ts'],
}