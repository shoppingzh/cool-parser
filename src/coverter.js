import { TYPES } from './consts'
import { match } from './utils/string'

const TYPES_ALIAS = {}
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

export function covertType(str) {
  const type = Object.keys(TYPES_ALIAS).find(type => TYPES_ALIAS[type].some(rule => match(str, rule)))
  return type ? parseInt(type) : null
}
