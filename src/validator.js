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
    new RegExp(`^${EXP_KEYS.CORRECT_ANSWER_HEAD}`)
  ])
}

/**
 * 是否为分数设置
 * @param {String} str 
 */
export function isScoreSettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.SCORE_HEAD}`)
  ])
}

/**
 * 是否为难度设置
 * @param {String} str 
 */
export function isDifficultySettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.DIFFICULTY_HEAD}`)
  ])
}

/**
 * 是否为解析设置
 * @param {String} str 
 */
export function isAnalyseSettings(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.ANALYSE_HEAD}`)
  ])
}

/**
 * 是否是设置项
 * @param {String} str 
 */
export function isSettings(str) {
  return [isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings].some(func => func(str))
}

/**
 * 是否是正常分数
 * @param {String} value 
 */
export function isNormalScore(value) {
  return value && value > 0
}

/**
 * 是否为选择题选项
 * @param {String} str 
 */
export function isChoiceOption(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.CHOICE_OPTION_ORDER_HEAD}`)
  ])
}

/**
 * 是否为连线题选项行
 * @param {String} str 
 */
export function isMatchOption(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.CHOICE_OPTION_ORDER_HEAD}.*?${EXP_KEYS.CHOICE_OPTION_ORDER_HEAD}.+$`)
  ])
}

/**
 * 是否为简答题的答案项
 * @param {String} str 
 */
export function isAnswerOption(str) {
  return testSome(str, [
    new RegExp(`^${EXP_KEYS.ANSWER_OPTION_HEAD}`)
  ])
}
