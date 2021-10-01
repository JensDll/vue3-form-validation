import fs from 'fs-extra'

export const packageNames = fs.readdirSync('packages')
