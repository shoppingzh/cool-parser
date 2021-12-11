import { TYPES, DIFFICULTY, EXP_KEYS } from './consts'
import { readLines, splitLines } from './utils/string'
import { containsImgTag, isSettings, isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings, isNormalScore, isChoiceOption, isMatchOption, isAnswerOption } from './validator'
import { parseCorrectAnswer, parseScore, parseDifficulty, parseAnalyse, parseStemOrder, parseStemType, parseStemCorrectAnswer, parseChoiceOption, parseMatchLine, parseAnswerLine, parseFillAnswerLine } from './parse'
import { convertType, convertDifficulty } from './converter'

function guessType(str) {
  if (isChoiceOption(str)) {
    if (isMatchOption(str)) return TYPES.MATCH
    return TYPES.SINGLE_CHOICE
  }
  if (isAnswerOption(str)) return TYPES.ANSWER
  return TYPES.UNORDER_FILL
}

function parseChoiceOptions(lines) {
  const options = []
  lines.forEach(line => {
    const result = parseChoiceOption(line)
    if (!result) {
      const lastOption = options[options.length - 1]
      if (lastOption) {
        lastOption.content += `\n${line}`
      }
    } else {
      options.push({
        order: result.order,
        content: result.content
      })
    }
  })
  return options
}

function parseMatchOptions(lines) {
  const options = []
  lines.forEach(line => {
    const result = parseMatchLine(line)
    if (!result) return
    options.push(result)
  })
  return options
}

function parseAnswerOptions(lines) {
  const options = []
  lines.forEach(line => {
    const result = parseAnswerLine(line)
    if (!result) return
    options.push(result)
  })
  return options
}

function parseFillOptions(lines) {
  const options = []
  lines.forEach(line => {
    options.push(...parseFillAnswerLine(line))
  })
  return options
}

export default class Parser {
  constructor(content) {
    this.content = content
    this.errors = []
    console.log(this)
  }

  _parseAreas() {
    this.blocks = {
      stem: '',
      main: '',
      settings: ''
    }
    let blockIdx = 0
    const lines = splitLines(this.content)
    for (let [index, line] of lines.entries()) {
      line = line.trim()
      if (blockIdx === 0) {
        if (index <= 0 || containsImgTag(line)) {
          this.blocks.stem += `${line}\n`
        } else {
          blockIdx++
        }
      }
      if (blockIdx === 1) {
        if (!isSettings(line)) {
          this.blocks.main += `${line}\n`
        } else {
          blockIdx++
        }
      }
      if (blockIdx === 2) {
        this.blocks.settings += `${line}\n`
      }
    }
  }

  _parseStem() {
    this.stem = {
      order: null,
      content: '',
      answer: null,
      type: null
    }
    
    readLines(this.blocks.stem, (line, index) => {
      if (index > 0) {
        this.stem.content += line
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
        const type = convertType(typeResult.current)
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
        this.stem.answer = answerResult.current
      }
      this.stem.content += content
    })
  }

  _parseSettings() {
    this.settings = {
      answer: null,
      score: null,
      difficulty: null,
      analyse: null
    }
    readLines(this.blocks.settings, (line, index) => {
      if (isCorrectAnswerSettings(line)) {
        this.settings.answer = parseCorrectAnswer(line)
      }
      if (isScoreSettings(line)) {
        const score = parseFloat(parseScore(line))
        if (isNormalScore(score)) {
          this.settings.score = score
        } else {
          this.errors.push('请输入正确分值（可为小数，但不允许为负数）')
        }
      }
      if (isDifficultySettings(line)) {
        const difficulty = convertDifficulty(parseDifficulty(line))
        if (difficulty != null) {
          this.settings.difficulty = difficulty
        } else {
          this.errors.push('请输入正确的难易度')
        }
      }
      if (isAnalyseSettings(line)) {
        this.settings.analyse = parseAnalyse(line)
      }
    })
  }

  _parseMain() {
    this.main = {
      type: null,
      options: []
    }
    const lines = splitLines(this.blocks.main)
    const firstLine = lines[0]
    this.main.type = guessType(firstLine)
    if (this.main.type === TYPES.SINGLE_CHOICE) {
      this.main.options = parseChoiceOptions(lines)
    } else if (this.main.type === TYPES.UNORDER_FILL) {
      this.main.options = parseFillOptions(lines)
    } else if (this.main.type === TYPES.MATCH) {
      this.main.options = parseMatchOptions(lines)
    } else if (this.main.type === TYPES.ANSWER) {
      this.main.options = parseAnswerOptions(lines)
    }
  }

  
  generateQuestion() {
    const question = {
      type: null,
      stem: null,
      options: [],
      difficulty: null,
      score: null
    }

    return question
  }

  parse() {
    // 划分区域：题干区、选项/答案区、设置区
    this._parseAreas()
    this._parseStem()
    this._parseSettings()
    this._parseMain()

    return {
      errors: this.errors,
      question: this.generateQuestion()
    }
  }
}