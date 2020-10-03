export function humanize(text: string) {
  const words = text.split(`-`)
  return words
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    })
    .join(` `)
}
