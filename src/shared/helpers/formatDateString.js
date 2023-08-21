const formatDateString = value => {
  if (typeof value === 'string') {
    const splittedByT = value.split('T')
    const splittedDate = splittedByT[0].split('-')

    if (splittedByT.length > 0 && splittedDate.length === 3) {
      const year = splittedDate[0]
      const month = splittedDate[1]
      const day = splittedDate[2]

      return `${day}.${month}.${year}`
    } else {
      return ''
    }
  } else {
    return ''
  }
}

export default formatDateString