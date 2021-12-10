import { testSome } from './utils/regexp'
import { EXP_KEYS } from './consts'

/**
 * 判断字符串中是否含有<img>标签
 * @param {String} str 
 */
export function containsImgTag(str) {
  return /<img.*?>/.test(str)
}

/**
 * 判断是否为正确答案设置
 * @param {String} str 
 */
export function isCorrectAnswerSettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.CORRECT_ANSWER}`)
  ])
}

/**
 * 是否为分数设置
 * @param {String} str 
 */
export function isScoreSettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.SCORE}`)
  ])
}

/**
 * 是否为难度设置
 * @param {String} str 
 */
export function isDifficultySettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.DIFFICULTY}`)
  ])
}

/**
 * 是否为解析设置
 * @param {String} str 
 */
export function isAnalyseSettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.ANALYSE}`)
  ])
}

/**
 * 是否是设置项
 * @param {String} str 
 */
export function isSettings(str) {
  return [isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings].some(func => func(str))
}
