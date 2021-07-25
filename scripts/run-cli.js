#!/usr/bin/env node
const { spawn } = require("child_process")
const path = require("path")
const child = spawn("tsc && npx cross-env NODE_PATH=./dist node dist/src/cli.js", {
  cwd: path.join(__dirname, ".."),
  shell: true,
})
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
