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
  CORRECT_ANSWER_HEAD: '\\s*(正确)?答案\\s*[:：]\\s*', // 正确答案开头
  ANALYSE_HEAD: '\\s*(试题)?[解分]析\\s*[:：]\\s*', // 解析开头
  SCORE_HEAD: '\\s*分[值数]\\s*[:：]\\s*', // 分数开头
  DIFFICULTY_HEAD: '\\s*难易?度\\s*[:：]\\s*', // 难易度开头
  STEM_ORDER_HEAD: '\\s*(\\d+)[.、,，]\\s*', // 题干序号开头
  TYPE: '[\\[【]\\s*(\\S+)\\s*[\\]】]', // 试题类型
  CHOICE_OPTION_ORDER_HEAD: '\\s*([A-Za-z1-9])\\s*[、\\.]\\s*', // 选择题选项序号开头
  ANSWER_OPTION_HEAD: '\\s*(普通|核心)\\s*关键词\\s*[:：]' // 简答题关键词开头
}

// 判断题的选项
export const JUDGMENT_OPTIONS = [
  ['是', '否'],
  ['对', '错'],
  ['有', '无'],
  ['可以', '不可以'],
  // 英文
  ['true', 'false']
]
