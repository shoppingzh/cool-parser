/**
 * 按行拆分
 * @param {String} text 内容文本
 */
export function splitLines(text = '', num = 1) {
  return text.replaceAll('\r\n', '\n').split(new RegExp(`\\n{${num},}`))
}

/**
 * 逐行扫描文本
 * @param {String} text 内容
 * @param {Function} cb 扫描每行回调
 * @param {Number} from 开始扫描行索引，默认为行初
 * @param {Number} to 结束扫描行索引，默认为行尾
 */
export function readLines(text = '', cb, from, to) {
  const lines = splitLines(text)
  const fromIdx = from > 0 ? Math.min(from, lines.length - 1) : 0
  const toIdx = to == null ? lines.length : (to > 0 ? Math.min(to, lines.length) : 0)
  for (let i = fromIdx; i < toIdx; i++) {
    if (!cb) continue
    const line = lines[i]
    if (cb(line, i, lines)) break
  }
}

/**
 * 判断字符串是否满足对比字符串或正则表达式
 * @param {String} str 原字符串
 * @param {String|RegExp} rule 字符串或正则表达式
 */
export function match(str, rule) {
  if (typeof rule === 'string') {
    return str.trim() === rule
  }
  if (typeof rule === 'object' && rule.test) {
    return rule.test(str)
  }
  return false
}