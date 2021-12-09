import { find } from './utils/regexp'

/**
 * 解析正确答案
 * @param {String} str 输入字符串
 */
export function parseCorrectAnswer(str) {
  return find(/(正确)?答案\s*[:：]\s*(.*)/, str, 2)
}

/**
 * 解析分数
 * @param {String} str
 */
export function parseScore(str) {
  return find(/分[值数]\s*[:：]\s*(\d+)/, str, 1)
}

/**
 * 解析试题解析
 * @param {String} str 
 */
export function parseAnalyse(str) {
  return find(/(试题)?[解分]析\s*[:：](.*)/, str, 2)
}

/**
 * 解析难易度
 * @param {String} str
 */
export function parseDifficulty(str) {
  return find(/难易?度\s*[:：](.*)/, str, 1)
}
