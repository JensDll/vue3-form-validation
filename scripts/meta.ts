import fs from 'fs-extra'

export const buildTargets = fs.readdirSync('packages')
export const buildFormats = ['esm', 'cjs']
