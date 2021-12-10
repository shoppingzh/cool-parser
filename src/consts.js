export const TYPES = {
  SINGLE_CHOICE: 1, // 单选题
  MULTIPLE_CHOICE: 2, // 多选题
  JUDGMENT: 3, // 判断题
  ORDER_FILL: 4, // 有序填空
  UNORDER_FILL: 5, // 无序填空
  SORT: 6, // 排序
  MATCH: 7, //连线
  ANSWER: 8 // 简答题
}

export const DIFFICULTY = {
  HARD: 0, // 难
  GENERAL: 1, // 中
  SIMPLE: 2 // 易
}

export const EXP_KEYS = {
  CORRECT_ANSWER: '\\s*(正确)?答案\\s*[:：]\\s*', // 正确答案
  ANALYSE: '\\s*(试题)?[解分]析\\s*[:：]\\s*', // 解析
  SCORE: '\\s*分[值数]\\s*[:：]\\s*', // 分数
  DIFFICULTY: '\\s*难易?度\\s*[:：]\\s*', // 难易度
  STEM_ORDER: '\\s*(\\d+)[.、,，]\\s*', // 题干序号
  TYPE: '[\\[【]\\s*(\\S+)\\s*[\\]】]' // 试题类型
}
