import { ChildProcess, exec } from "child_process"

export const spawnChildProcess = (command: string): ChildProcess => {
  const child = exec(command)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

export const promisifyChildProcess = (child: ChildProcess): Promise<any> => {
  return new Promise((resolve, reject) => {
    child.on("close", resolve)
    child.on("error", reject)
  })
}
