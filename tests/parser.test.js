const { parseCorrectAnswer, parseScore } = require('../dist/parse')

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


