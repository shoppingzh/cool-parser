const { isSettings, isChoiceOption, isMatchOption, isJudgmentOption, isSortAnswer } = require('../dist/validator')

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

test('是否是判断题选项', () => {
  ['对', '错', '是', '否', '可以', '不可以', 'true', 'false'].forEach(option => {
    expect(isJudgmentOption(option)).toBe(true)
  })
})

test('是否为判断题选项（行）', () => {
  expect(isJudgmentOption('行')).toBe(false)
})

test('是否为排序题的答案', () => {
  [
    'A, B, C',
    'A，B，C',
    '1, 2, 3'
  ].forEach(answer => {
    expect(isSortAnswer(answer)).toBe(true)
  })
})

test('是否为排序题的答案', () => {
  [
    'ABC'
  ].forEach(answer => {
    expect(isSortAnswer(answer)).toBe(false)
  })
})