import { TYPES, DIFFICULTY, EXP_KEYS } from './consts'
import { readLines } from './utils/string'
import { containsImgTag, isSettings, isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings } from './validator'
import { parseCorrectAnswer, parseScore, parseDifficulty, parseAnalyse, removeStemOrder, parseSterm, parseStermOrder } from './parse'

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
  }

  _parseSterm() {
    let content = this.contentArea
    readLines(content, (line, index) => {
      if (index > 0) {
        return
      }
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
    this._parseSterm()

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
