const { isSettings, isChoiceOption, isMatchOption } = require('../dist/validator')

test('是否为设置项（答案：A）', () => {
  expect(isSettings('答案：A')).toBe(true)
})

test('是否为设置项（   答案：A）', () => {
  expect(isSettings('   答案：A')).toBe(true)
})

test('是否为设置项（A. 选项）', () => {
  expect(isSettings('A. 选项')).toBe(false)
})

test('是否为选择题选项？（A、选项一）', () => {
  expect(isChoiceOption('A、选项一')).toBe(true)
})

test('是否为选择题选项？（A、   选项一）', () => {
  expect(isChoiceOption('A、   选项一')).toBe(true)
})

test('是否为选择题选项？（选项一）', () => {
  expect(isChoiceOption('选项一')).toBe(false)
})

test('是否为选择题选项？（A.      选项一）', () => {
  expect(isChoiceOption('A.      选项一')).toBe(true)
})

// 暂不支持
// test('是否为选择题选项？（[A] 选项一）', () => {
//   expect(isChoiceOption('[A] 选项一')).toBe(true)
// })

test('是否为连线题选项？（A、选项一）', () => {
  expect(isMatchOption('A、选项一')).toBe(false)
})

test('是否为连线题选项？（A、选项一   1. 答案1）', () => {
  expect(isMatchOption('A、选项一   1. 答案1')).toBe(true)
})

