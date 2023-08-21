const isFirstOrSecondName = value => /^([A-Z]){1}([a-z]){0,}$/g.test(value)

const isUserName = value => /^([A-Z]){2}([a-z]){0,}$/g.test(value)

const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(value)

const isPhone = value => /^\d{10}$/g.test(value)

const isDate = value => /^\d{2}.\d{2}.\d{2}$/g.test(value)

const mayBeDate = value => /\d{1,}\./.test(value)

const isDigit = value => /^\d{1,}$/g.test(value)

export {
  isFirstOrSecondName,
  isUserName,
  isEmail,
  isPhone,
  isDate,
  mayBeDate,
  isDigit
}