const { parseCorrectAnswer, parseScore, parseChoiceContent, removeStemOrder } = require('../dist/parse')

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

test('解析选择题选项（A.）', () => {
  expect(parseChoiceContent('A. 选项1')).toBe('选项1')
})

test('解析选择题选择（A、）', () => {
  expect(parseChoiceContent('A、选项1')).toBe('选项1')
})

test('去掉题干区序号（1. 我是题干）', () => {
  expect(removeStemOrder('1. 我是题干')).toBe('我是题干')
})

test('去掉题干区序号（1、 我是题干）', () => {
  expect(removeStemOrder('1、 我是题干')).toBe('我是题干')
})

test('去掉题干区序号（     1，     我是题干）', () => {
  expect(removeStemOrder('     1，     我是题干')).toBe('我是题干')
})

