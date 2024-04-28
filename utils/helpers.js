function slugify(string) {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;"
  const b =
    "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

function titleIfy(slug) {
  // Regular expression to capitalize the first letter of each word and replace dashes with spaces
  return slug.replace(/-/g, " ").replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase()
  })
}

function getTrimmedString(string, length = 8) {
  if (string.length <= length) {
    return string
  } else {
    return string.substring(0, length) + "..."
  }
}

export { slugify, titleIfy, getTrimmedString }
