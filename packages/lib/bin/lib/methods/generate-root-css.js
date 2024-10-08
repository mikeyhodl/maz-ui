const fs = require('fs')
const { EOL: endOfLine } = require('os')
const render = require('json-templater/string')

const LIGHT_TEMPLATE = `
/* Automatically generated by 'maz-ui' */

/* stylelint-disable */

:root {
{{light_include}}
}`

const DARK_TEMPLATE = `.maz-is-dark {
{{dark_include}}
}`

const END_TEMPLATE = `
/* stylelint-enable */`



module.exports = (variables, output) => {
  const lightProperties = Object.entries(variables.light)
    .map((values) => `  ${values[0]}: ${values[1]};`)
    .join(endOfLine)
  const darkProperties = Object.entries(variables.dark)
    .map((values) => `  ${values[0]}: ${values[1]};`)
    .join(endOfLine)

  const lightTemplate = render(LIGHT_TEMPLATE, {
    light_include: lightProperties,
    dark_include: darkProperties
  })

  const darkTemplate = render(DARK_TEMPLATE, {
    light_include: lightProperties,
    dark_include: darkProperties
  })

  const result = `
  ${lightTemplate}
  ${darkProperties ? darkTemplate : ''}
  ${END_TEMPLATE}
  `.trim()

  fs.writeFileSync(output, result)

  // eslint-disable-next-line no-console
  console.log('\x1B[32m', '[build root css file] DONE:', output)
}
