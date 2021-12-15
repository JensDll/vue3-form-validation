import { execa } from 'execa'

export function run(file: string, args?: readonly string[]) {
  return execa(file, args, { stdio: 'inherit' })
}
