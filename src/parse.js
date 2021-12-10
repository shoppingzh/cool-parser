import { find, exec, findContext } from './utils/regexp'
import { EXP_KEYS } from './consts'
import { readLines } from './utils/string'

/**
 * 解析正确答案
 * @param {String} str 输入字符串
 */
export function parseCorrectAnswer(str) {
  return find(str, new RegExp(`${EXP_KEYS.CORRECT_ANSWER}(.*)`), 2)
}

/**
 * 解析分数
 * @param {String} str
 */
export function parseScore(str) {
  return find(str, new RegExp(`${EXP_KEYS.SCORE}(\\d+)`), 1)
}

/**
 * 解析难易度
 * @param {String} str
 */
 export function parseDifficulty(str) {
  return find(str, new RegExp(`${EXP_KEYS.DIFFICULTY}(.*)`), 1)
}

/**
 * 解析试题解析
 * @param {String} str 
 */
export function parseAnalyse(str) {
  return find(str, new RegExp(`${EXP_KEYS.ANALYSE}(.*)`), 2)
}

/**
 * 解析选择题选项
 * @param {String} str 
 */
export function parseChoiceContent(str) {
  return find(str, /^[A-Za-z1-9]\s*[、\.]\s*(.*)/, 1)
}

/**
 * 解析题干序号
 * @param {String} str 
 */
export function parseStemOrder(str) {
  return findContext(str, new RegExp(`^${EXP_KEYS.STEM_ORDER}`), 1)
}

/**
 * 解析题干中的题型
 * @param {String} str 
 * @returns 
 */
export function parseStemType(str) {
  return findContext(str, new RegExp(`\\s*${EXP_KEYS.TYPE}\\s*$`), 1)
}

/**
 * 解析题干中的正确答案
 * @param {String} str 
 * @returns 
 */
export function parseStemCorrectAnswer(str) {
  return findContext(str, new RegExp(`[(（](.*)?[)）]`), 1)
}
