import Parser from './parser'

export function parse(content) {
  return new Parser(content).parse()
}
