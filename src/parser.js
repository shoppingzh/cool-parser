import { TYPES, DIFFICULTY, EXP_KEYS } from './consts'
import { readLines, splitLines } from './utils/string'
import { containsImgTag, isSettings, isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings, isNormalScore, isChoiceOption, isMatchOption, isAnswerOption } from './validator'
import { parseCorrectAnswer, parseScore, parseDifficulty, parseAnalyse, parseStemOrder, parseStemType, parseStemCorrectAnswer, parseChoiceOption, parseMatchLine, parseAnswerAnswerLine, parseFillAnswerLine } from './parse'
import { convertType, convertDifficulty } from './converter'

/**
 * 根据选项/答案区的第一行推导题型
 * @param {String} str 
 * @returns 
 */
function guessType(str) {
  if (isChoiceOption(str)) {
    if (isMatchOption(str)) return TYPES.MATCH
    return TYPES.SINGLE_CHOICE
  }
  if (isAnswerOption(str)) return TYPES.ANSWER
  return TYPES.UNORDER_FILL
}

/**
 * 解析所有选择题选项
 * @param {Array} lines 
 * @returns 
 */
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

/**
 * 解析所有连线题选项
 * @param {Array} lines 
 * @returns 
 */
function parseMatchOptions(lines) {
  const options = []
  lines.forEach(line => {
    const result = parseMatchLine(line)
    if (!result) return
    options.push(result)
  })
  return options
}

/**
 * 解析简答题答案
 * @param {Array} lines 
 * @returns 
 */
function parseAnswerAnswer(lines) {
  const answer = {
    general: [],
    core: []
  }
  lines.forEach(line => {
    const result = parseAnswerAnswerLine(line)
    if (!result) return
    answer[result.type === 0 ? 'general' : 'core'].push(...result.items)
  })
  return answer
}

/**
 * 解析填空题答案
 * @param {Array} lines 
 * @returns 
 */
function parseFillAnswer(lines) {
  const answer = []
  lines.forEach(line => {
    answer.push(...parseFillAnswerLine(line))
  })
  return answer
}

export default class Parser {
  constructor(content) {
    this.content = content
    this.errors = []
  }

  _log(description, level) {
    this.errors.push({
      description,
      level
    })
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
        content = orderResult.content
        this.stem.order = parseInt(orderResult.order)
      }
      const typeResult = parseStemType(content)
      if (typeResult) {
        const type = convertType(typeResult.type)
        if (type != null) {
          content = typeResult.content
          this.stem.type = type
        } else {
          this._log('试题类型错误')
        }
      }
      const answerResult = parseStemCorrectAnswer(content)
      if (answerResult) {
        content = answerResult.head + answerResult.tail
        this.stem.answer = answerResult.answer
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
          this._log('请输入正确分值（可为小数，但不允许为负数）')
        }
      }
      if (isDifficultySettings(line)) {
        const difficulty = convertDifficulty(parseDifficulty(line))
        if (difficulty != null) {
          this.settings.difficulty = difficulty
        } else {
          this._log('请输入正确的难易度')
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
      options: null,
      answer: null
    }
    const lines = splitLines(this.blocks.main)
    const firstLine = lines[0]
    this.main.type = guessType(firstLine)
    if (this.main.type === TYPES.SINGLE_CHOICE) {
      this.main.options = parseChoiceOptions(lines)
    } else if (this.main.type === TYPES.UNORDER_FILL) {
      this.main.answer = parseFillAnswer(lines)
    } else if (this.main.type === TYPES.MATCH) {
      this.main.options = parseMatchOptions(lines)
    } else if (this.main.type === TYPES.ANSWER) {
      this.main.answer = parseAnswerAnswer(lines)
    }
  }

  
  generateQuestion() {
    const type = this.stem.type || this.main.type || TYPES.ANSWER
    const answer = this.settings.answer || this.stem.answer || this.main.answer
    const options = this.main.options
    let convertAnswer = null
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE].indexOf(type) >= 0) {
      convertAnswer = answer.split('')
    } else if ([TYPES.JUDGMENT].indexOf(type) >= 0) {
      // TODO:
    } else if ([TYPES.SORT, TYPES.MATCH].indexOf(type) >= 0) {
      convertAnswer = answer.split(/[,，]/)
    } else if ([TYPES.ORDER_FILL, TYPES.UNORDER_FILL, TYPES.ANSWER].indexOf(type) >= 0) {
      convertAnswer = answer
    }
    // 选择题（单选/多选/排序/连线）选项为空校验
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.SORT, TYPES.MATCH].indexOf(type) >= 0) {
      if (!this.main.options || !this.main.options) {
        this._log('选项为空')
      }
    }
    // 答案为空校验
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.JUDGMENT, TYPES.ORDER_FILL, TYPES.UNORDER_FILL,
      TYPES.SORT, TYPES.MATCH].indexOf(type) >= 0 && !answer) {
      this._log('没有设置答案')
    }
    // 选择题（单选/多选/排序/连线）答案是否与选项匹配校验
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE].indexOf(type) >= 0 && answer) {
      const answerItems = answer.split('')
      const orders = options.map(o => o.order)
      answerItems.forEach(answerItem => {
        if (orders.indexOf(answerItem) < 0) {
          this._log(`正确答案有误：选项${answerItem}不存在`)
        }
      })
    }
    // TODO: 更多情况
    const question = {
      type,
      stem: this.stem.content,
      options,
      answer: convertAnswer,
      difficulty: this.settings.difficulty,
      score: this.settings.score,
      analyse: this.settings.analyse
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