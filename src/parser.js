import { TYPES, DIFFICULTY, EXP_KEYS, JUDGMENT_OPTIONS } from './consts'
import { readLines, splitLines } from './utils/string'
import { containsImgTag, isSettings, isCorrectAnswerSettings, isScoreSettings, isDifficultySettings, isAnalyseSettings, isNormalScore, isChoiceOption, isMatchOption, isAnswerOption, isJudgmentOption, isSortAnswer } from './validator'
import { parseCorrectAnswer, parseScore, parseDifficulty, parseAnalyse, parseStemOrder, parseStemType, parseStemCorrectAnswer, parseChoiceOption, parseMatchLine, parseAnswerAnswerLine, parseFillAnswerLine } from './parse'
import { convertType, convertDifficulty } from './converter'

/**
 * 根据选项/答案区的第一行推导题型
 * 1. 带有选项且不为连线题选项，则为选择题（单选、多选、排序）
 * 2. 带有选项且为连线题选项，则为连线题
 * 3. 带有简答题答案，则为简答题
 * 4. 答案区不为空，则为填空题
 * 5. 答案区为空，则为简答题或判断题
 * @param {String} line 
 * @returns 
 */
function guessType(line) {
  if (isChoiceOption(line)) {
    if (isMatchOption(line)) return TYPES.MATCH
    return TYPES.SINGLE_CHOICE
  }
  if (isAnswerOption(line)) return TYPES.ANSWER
  return line ? TYPES.UNORDER_FILL : TYPES.ANSWER
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

/**
 * 根据判断题答案获取选项列表
 * @param {String} answer 
 */
function getJudgmentOptions(answer) {
  return JUDGMENT_OPTIONS.find(o => o.indexOf(answer) >= 0)
}

export default class Parser {
  constructor(content) {
    this.content = content
    this.errors = []
    console.log(this)
  }

  _log(description, level = 0) {
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
    let type = this.stem.type || this.main.type || TYPES.ANSWER // 题干区的题型优先级最高，其次采用识别题型
    let options = this.main.options // 选项列表(单选/多选/判断/排序/连线)
    let answer = this.settings.answer || this.stem.answer // 设置区的答案优先级最高，其次才用题干中的答案
    let convertAnswer = this.main.answer // 根据答案区解析出的转换后的答案(填空/简答)
    // 1. 矫正题型：识别的题型可能有误，根据多种角度对题型进行矫正
    // 1.3 多选题(识别为单选题且存在多个答案的)
    if (type === TYPES.SINGLE_CHOICE && answer.split(/\s*/).length > 1) {
      type = TYPES.MULTIPLE_CHOICE
    }
    // 1.2 判断题(没有识别为选择题、填空题、排序题、连线题的，且答案中带有判断题选项的)
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.ORDER_FILL, TYPES.UNORDER_FILL, TYPES.SORT, TYPES.MATCH].indexOf(this.main.type) < 0) {
      const judgmentOptions = getJudgmentOptions(answer)
      if (judgmentOptions && judgmentOptions.length) {
        type = TYPES.JUDGMENT
        options = [
          { content: judgmentOptions[0], value: true },
          { content: judgmentOptions[1], value: false }
        ]
        convertAnswer = answer === judgmentOptions[0]
      }
    }
    // 1.3 排序题(识别为选择题，但答案符合排序题答案规则)
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE].indexOf(type) >= 0 && isSortAnswer(answer)) {
      type = TYPES.SORT
    }

    // 2. 处理选项
    // TODO:

    // 3. 处理正确答案
    if (type === TYPES.SINGLE_CHOICE || type === TYPES.MULTIPLE_CHOICE) {
      convertAnswer = answer.split(/\s*/)
    } else if (type === TYPES.JUDGMENT) {
      // 已处理
    } else if (type === TYPES.ORDER_FILL || type === TYPES.UNORDER_FILL) {
      // 已处理
    } else if (type === TYPES.SORT) {
      convertAnswer = answer.split(/\s*[,，]\s*/)
    } else if (type === TYPES.MATCH) {
      const parts = answer.split(/\s*[,，]\s*/)
      convertAnswer = parts.reduce((answer, part) => {
        const leftRight = part.split(/\s*-\s*/)
        answer[leftRight[0]] = leftRight[1]
        return answer
      }, {})
    } else if (type === TYPES.ANSWER) {
      // 已处理
    }

    // 4. 校验试题完整性
    // 4.1 是否设置选项
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.JUDGMENT, TYPES.SORT, TYPES.MATCH].indexOf(type) >= 0) {
      if (!options || !options.length) {
        this._log('没有设置选项')
        this.options = []
      }
    }
    // 4.2 选项是否过多或过少
    // TODO:
    // 4.3 是否设置答案
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.JUDGMENT, TYPES.ORDER_FILL, TYPES.UNORDER_FILL, TYPES.SORT, TYPES.MATCH].indexOf(type) >= 0) {
      if (convertAnswer == null) {
        this._log('没有设置答案')
      }
    }
    // 4.4 答案与选项是否匹配
    if ([TYPES.SINGLE_CHOICE, TYPES.MULTIPLE_CHOICE, TYPES.SORT].indexOf(type) >= 0 && convertAnswer != null && options) {
      convertAnswer.forEach(item => {
        if (options.findIndex(o => o.order === item) < 0) {
          this._log(`答案${item}与选项不匹配`)
        }
      })
    }
    // 4.5 答案是否过多或过少
    // TODO:

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