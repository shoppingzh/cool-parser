/**
 * 逐行扫描文本
 * @param {String} text 内容
 * @param {Function} cb 扫描每行回调
 * @param {Number} from 开始扫描行索引，默认为行初
 * @param {Number} to 结束扫描行索引，默认为行尾
 */
export function readLines(text = '', cb, from, to) {
  const lines = text.split(/\r?\n/)
  const fromIdx = from > 0 ? Math.min(from, lines.length - 1) : 0
  const toIdx = to == null ? lines.length : (to > 0 ? Math.min(to, lines.length) : 0)
  for (let i = fromIdx; i < toIdx; i++) {
    if (!cb) continue
    const line = lines[i]
    if (cb(line, i, lines)) break
  }
}