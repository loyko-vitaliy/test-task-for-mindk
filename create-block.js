const { appendFile, mkdir } = require('fs')
const { promisify } = require('util')

const createDirectory = promisify(mkdir)
const createFile = promisify(appendFile)

const createBlockFile = async (path, content) => {
  try {
    await createFile(path, content)
  } catch (error) {
    console.log(error)
  }
}

const createBlock = async () => {
  const blocksDirectory = './src/blocks'
  const blockName = process.argv[2]
  const blockPath = `${blocksDirectory}/${blockName}`

  try {
    await createDirectory(blockPath)
    await createDirectory(`${blockPath}/img`)
    await createBlockFile(`${blockPath}/index.pug`, `mixin ${blockName}(data)\n\t- const className = attributes.class\n\tdiv(class=className)\n\t\tblock`)
    await createBlockFile(`${blockPath}/index.scss`, `.${blockName} {}`)
    await createBlockFile(`${blockPath}/index.js`, ``)
    await createBlockFile(`${blockPath}/data.json`, ``)

    console.log(`Блок ${blockName} успешно создан.`)
  } catch (error) {
    console.log(error)
  }
}

createBlock()