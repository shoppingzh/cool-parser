const { TYPES } = require('../dist/consts')
const { covertType } = require('../dist/coverter')

test('转换题型', () => {
  expect(covertType('单选题')).toBe(TYPES.SINGLE_CHOICE)
})
