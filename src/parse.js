import { find, exec, findContext } from './utils/regexp'
import { EXP_KEYS } from './consts'
import { readLines } from './utils/string'

/**
 * 解析正确答案
 * @param {String} str 输入字符串
 */
export function parseCorrectAnswer(str) {
  return find(str, new RegExp(`${EXP_KEYS.CORRECT_ANSWER_HEAD}(.*)`), 2)
}

/**
 * 解析分数
 * @param {String} str
 */
export function parseScore(str) {
  return find(str, new RegExp(`${EXP_KEYS.SCORE_HEAD}(-?\\d+(\\.\\d)?)`), 1)
}

/**
 * 解析难易度
 * @param {String} str
 */
 export function parseDifficulty(str) {
  return find(str, new RegExp(`${EXP_KEYS.DIFFICULTY_HEAD}(.*)`), 1)
}

/**
 * 解析试题解析
 * @param {String} str 
 */
export function parseAnalyse(str) {
  return find(str, new RegExp(`${EXP_KEYS.ANALYSE_HEAD}(.*)`), 2)
}

/**
 * 解析题干序号
 * @param {String} str 
 */
export function parseStemOrder(str) {
  const result = findContext(str, new RegExp(`^${EXP_KEYS.STEM_ORDER_HEAD}`), 1)
  return result ? {
    order: result.current,
    content: result.tail
  } : null
}

/**
 * 解析题干中的题型
 * @param {String} str 
 * @returns 
 */
export function parseStemType(str) {
  const result = findContext(str, new RegExp(`\\s*${EXP_KEYS.TYPE}\\s*$`), 1)
  return result ? {
    type: result.current,
    content: result.head
  } : null
}

/**
 * 解析题干中的正确答案
 * @param {String} str 
 * @returns 
 */
export function parseStemCorrectAnswer(str) {
  const result = findContext(str, new RegExp(`[(（]\\s*([^)）]+)\\s*[)）]$`), 1)
  return result ? {
    answer: result.current,
    head: result.head,
    tail: result.tail
  } : null
}

/**
 * 解析选择题选项
 * @param {String} str 
 */
export function parseChoiceOption(str) {
  const result = findContext(str, new RegExp(`${EXP_KEYS.CHOICE_OPTION_ORDER_HEAD}`), 1)
  return result ? {
    order: result.current,
    content: result.tail
  } : null
}

/**
 * 解析连线题行
 * @param {String} line 
 */
export function parseMatchLine(line) {
  const leftResult = parseChoiceOption(line)
  if (!leftResult) return null
  const option = {
    left: null,
    right: null
  }
  // 解析左侧
  const context = findContext(leftResult.content, new RegExp(`${EXP_KEYS.CHOICE_OPTION_ORDER_HEAD}`), 0)
  option.left = {
    order: leftResult.order,
    content: context ? context.head : leftResult.content
  }
  if (!context) return option
  // 解析右侧
  const rightResult = parseChoiceOption(`${context.current}${context.tail}`)
  if (rightResult) {
    option.right = {
      order: rightResult.order,
      content: rightResult.content
    }
  }
  return option
}

/**
 * 解析简答题答案行
 * @param {String} str 
 */
export function parseAnswerAnswerLine(str) {
  const result = findContext(str, new RegExp(`${EXP_KEYS.ANSWER_OPTION_HEAD}`), 0)
  if (!result) return null
  const type = result.current.indexOf('普通') >= 0 ? 0 : 1
  const items = result.tail.split(/、/).map(o => o.split('|'))
  return {
    type,
    items
  }
}

/**
 * 解析填空题答案行
 * @param {String} line 
 */
export function parseFillAnswerLine(line) {
  return line.split('|').filter(o => o.trim()).map(o => o.split(/&{2,}/))
}
