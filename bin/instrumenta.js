#!/usr/bin/env node
const { exec } = require("child_process")
const path = require("path")
const nodePath = path.join(__dirname, "..", "dist")
const cliPath = path.join(nodePath, "src", "cli")
const child = exec(`node ${cliPath} ${process.argv.slice(2).join(" ")}`, {
  env: { ...process.env, NODE_PATH: nodePath },
})

child.stdout.pipe(process.stdout)
