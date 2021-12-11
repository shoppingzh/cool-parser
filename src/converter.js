import { TYPES, DIFFICULTY } from './consts'
import { match } from './utils/string'

const TYPES_ALIAS = {}
const DIFFICULTY_ALIAS = {}

TYPES_ALIAS[TYPES.SINGLE_CHOICE] = [
  /单选题?/,
  /(单项)?选择题?/
]
TYPES_ALIAS[TYPES.MULTIPLE_CHOICE] = [
  /多选题?/,
  /(多项)?选择题?/
]
TYPES_ALIAS[TYPES.JUDGMENT] = [
  /判断题?/
]
TYPES_ALIAS[TYPES.ORDER_FILL] = [
  /(有序)?填空题?/
]
TYPES_ALIAS[TYPES.UNORDER_FILL] = [
  /(无序)?填空题?/
]
TYPES_ALIAS[TYPES.SORT] = [
  /排序题?/
]
TYPES_ALIAS[TYPES.MATCH] = [
  /连线(匹配)?题?/,
  /匹配题?/
]
TYPES_ALIAS[TYPES.ANSWER] = [
  /[简问]答题?/
]
DIFFICULTY_ALIAS[DIFFICULTY.SIMPLE] = [
  '简单',
  /容?易/
]
DIFFICULTY_ALIAS[DIFFICULTY.GENERAL] = [
  '一般',
  '普通',
  /中等?/
]
DIFFICULTY_ALIAS[DIFFICULTY.HARD] = [
  /困?难/
]

/**
 * 转换试题类型
 * @param {String} str 
 */
export function convertType(str) {
  const type = Object.keys(TYPES_ALIAS).find(type => TYPES_ALIAS[type].some(rule => match(str, rule)))
  return type != null ? parseInt(type) : null
}

/**
 * 转换难易度
 * @param {String} str 
 */
export function convertDifficulty(str) {
  const difficulty = Object.keys(DIFFICULTY_ALIAS).find(difficulty => DIFFICULTY_ALIAS[difficulty].some(rule => match(str, rule)))
  return difficulty != null ? parseInt(difficulty) : null
}
