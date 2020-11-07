export function filterNullish(object: any = {}) {
  return Object.keys(object).reduce((acc, key) => {
    if (typeof object[key] !== `undefined` && object[key] !== null) {
      return {
        ...acc,
        [key]: object[key],
      }
    }
    return acc
  }, {})
}

export function filterFalsey(object: any = {}) {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key]) {
      return {
        ...acc,
        [key]: object[key],
      }
    }
    return acc
  }, {})
}
