export const inquirerValidations = {
  notNull(answer: string) {
    if (!answer) {
      return 'You must inform exchange name.'
    }
    return true
  },
  atLeastOne(answer: string[]) {
    if (answer.length < 1) {
      return 'You must select at least one.'
    }
    return true
  },
}
