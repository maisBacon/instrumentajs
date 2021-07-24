"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifyChildProcess = exports.spawnChildProcess = void 0;
const child_process_1 = require("child_process");
const spawnChildProcess = (command) => {
    const child = child_process_1.spawn(command, { shell: true });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    return child;
};
exports.spawnChildProcess = spawnChildProcess;
const promisifyChildProcess = (child) => {
    return new Promise((resolve, reject) => {
        child.on("close", resolve);
        child.on("error", reject);
    });
};
exports.promisifyChildProcess = promisifyChildProcess;
