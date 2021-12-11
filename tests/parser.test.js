const { parseCorrectAnswer, parseScore, parseChoiceOption } = require('../dist/parse')

test('解析试题答案（正常情况）', () => {
  expect(parseCorrectAnswer('正确答案：A')).toBe('A')
})

test('解析试题答案（无“正确”）', () => {
  expect(parseCorrectAnswer('答案：A')).toBe('A')
})

test('解析试题答案（英文冒号）', () => {
  expect(parseCorrectAnswer('正确答案: A')).toBe('A')
})

test('解析试题答案（空格若干）', () => {
  expect(parseCorrectAnswer('正确答案：     A')).toBe('A')
})

test('解析分数（正常情况）', () => {
  expect(parseScore('分值：5')).toBe('5')
})

test('解析分数（分数）', () => {
  expect(parseScore('分数：12')).toBe('12')
})


test('解析选择题选项（A、选项一）', () => {
  expect(parseChoiceOption('A、选项一')).toStrictEqual({
    order: 'A',
    content: '选项一'
  })
})

test('解析选择题选项（A、使用其他车辆行驶证）', () => {
  expect(parseChoiceOption('A、使用其他车辆行驶证')).toStrictEqual({
    order: 'A',
    content: '使用其他车辆行驶证'
  })
})
