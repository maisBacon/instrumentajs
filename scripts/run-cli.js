const { spawn } = require("child_process")

const child = spawn(`node dist/src/cli.js ${process.argv.slice(2)}`, {
  env: {
    NODE_PATH: "./dist",
  },
  shell: true,
})

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
