
/**
 * 执行正则表达式
 * @param {String} str 原字符串
 * @param {RegExp} exp 正则表达式
 */
export function exec(str, exp) {
  return new RegExp(exp).exec(str)
}

/**
 * 根据正则表达式规则在字符串中寻找子串
 * @param {String} str 原字符串
 * @param {RegExp} exp 正则表达式
 * @param {Number} groupNum 组号
 */
export function find(str, exp, groupNum) {
  const result = exec(str, exp)
  return result ? result[groupNum] : null
}

/**
 * 根据正则表达式规则在字符串中寻找子串和上下文信息
 * @param {String} str 原字符串
 * @param {RegExp} exp 正则表达式
 * @param {Number} groupNum 组号
 */
export function findContext(str, exp, groupNum) {
  const result = exec(str, exp)
  if (!result) return null
  return {
    head: result.input.substring(0, result.index),
    current: result[groupNum],
    tail: result.input.substring(result.index + result[0].length)
  }
}

/**
 * 测试字符串是否通过所选正则表达式中的任意一个
 * @param {String} str 原字符串
 * @param {Array} exps 正则表达式数组
 */
export function testSome(str, exps) {
  return exps.some(exp => exp.test(str))
}

/**
 * 测试字符串是否通过所有正则表达式
 * @param {String} str 原字符串
 * @param {Array} exps 正则表达式集合
 */
export function testAll(str, exp) {
  return exps.every(exp => exp.test(str))
}
