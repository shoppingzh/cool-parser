import { TYPES, DIFFICULTY, EXP_KEYS } from './consts'
import { readLines } from './utils/string'
import { containsImgTag, isSettings, isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings } from './validator'
import { parseCorrectAnswer, parseScore, parseDifficulty, parseAnalyse, parseStemOrder, parseStemType, parseStemCorrectAnswer } from './parse'
import { covertType } from './coverter'

class ParseContext {
  constructor() {
    this.stem = null // 题干
    this.items = [] // 选项
    this.type = null // 题型
    this.answer = null // 正确答案
    this.score = null // 分值
    this.difficulty = null // 难度
    this.analyse = null // 解析
  }

  generate() {
    return {}
  }
}

export default class Parser {
  constructor(content) {
    this.content = content
    this.context = new ParseContext()
    this.errors = []
  }

  _parseStem() {
    this.stem = {
      order: null,
      inner: '',
      correctAnswer: null,
      type: null
    }
    
    readLines(this.contentArea, (line, index) => {
      if (index > 0) {
        this.stem.inner += line
        return
      }
      let content = line
      const orderResult = parseStemOrder(content)
      if (orderResult) {
        content = orderResult.tail
        this.stem.order = parseInt(orderResult.current)
      }
      const typeResult = parseStemType(content)
      if (typeResult) {
        const type = covertType(typeResult.current)
        if (type != null) {
          content = typeResult.head
          this.stem.type = type
        } else {
          this.errors.push('试题类型错误')
        }
      }
      const answerResult = parseStemCorrectAnswer(content)
      if (answerResult) {
        content = answerResult.head + answerResult.tail
        this.stem.correctAnswer = answerResult.current
      }
      this.stem.inner += content
    })
  }
  
  _parseAreas() {
    this.contentArea = ''
    this.itemsAnswerArea = ''
    this.settingsArea = ''
    this.settings = {
      correctAnswer: null,
      score: null,
      difficulty: null,
      analyse: null
    }
    let itemsAnswerAreaStartLine = 0
    let settingsStartLine = 0
    readLines(this.content, (line, index, lines) => {
      itemsAnswerAreaStartLine = index
      if (index > 0 && !containsImgTag(line)) return true
      this.contentArea += line
    })
    this._parseStem()

    readLines(this.content, (line, index) => {
      settingsStartLine = index
      if (isSettings(line)) return true
      this.itemsAnswerArea += `${line}\n`
    }, itemsAnswerAreaStartLine)
    readLines(this.content, (line, index) => {
      if (isCorrectAnswerSettings(line)) {
        this.settings.correctAnswer = parseCorrectAnswer(line)
      }
      if (isScoreSettings(line)) {
        this.settings.score = parseScore(line)
      }
      if (isDifficultySettings(line)) {
        this.settings.difficulty = parseDifficulty(line)
      }
      if (isAnalyseSettings(line)) {
        this.settings.analyse = parseAnalyse(line)
      }
    }, settingsStartLine)

    // 解析选项/答案区
  }

  parse() {
    // 划分区域：题干区、选项/答案区、设置区
    this._parseAreas()
  }
}
