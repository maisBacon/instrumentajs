import {ChildProcess, spawn} from "child_process"

export const spawnChildProcess = (command: string): ChildProcess => {
  const child = spawn(command, { shell: true })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}
