const { TYPES, DIFFICULTY } = require('../dist/consts')
const { convertType, convertDifficulty } = require('../dist/converter')

test('转换题型（单选题）', () => {
  expect(convertType('单选题')).toBe(TYPES.SINGLE_CHOICE)
})

test('转换题型（单选）', () => {
  expect(convertType('单选')).toBe(TYPES.SINGLE_CHOICE)
})

test('转换难易度（难）', () => {
  expect(convertDifficulty('难')).toBe(DIFFICULTY.HARD)
})

test('转换难易度（困难）', () => {
  expect(convertDifficulty('困难')).toBe(DIFFICULTY.HARD)
})
