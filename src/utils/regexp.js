export function find(exp, str, groupNum) {
  const re = new RegExp(exp)
  const result = re.exec(str)
  return result ? result[groupNum] : null
}
