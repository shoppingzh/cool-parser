const { isSettings } = require('../dist/validator')

test('是否为设置项（答案：A）', () => {
  expect(isSettings('答案：A')).toBe(true)
})

test('是否为设置项（   答案：A）', () => {
  expect(isSettings('   答案：A')).toBe(true)
})

test('是否为设置项（A. 选项）', () => {
  expect(isSettings('A. 选项')).toBe(false)
})
