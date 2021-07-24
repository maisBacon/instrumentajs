#!/usr/bin/env node
const { spawn } = require("child_process")
const path = require("path")
const child = spawn(`node dist/src/cli.js ${process.argv.slice(2)}`, {
  env: {
    NODE_PATH: path.join(__dirname, "./dist"),
  },
  shell: true,
})

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
