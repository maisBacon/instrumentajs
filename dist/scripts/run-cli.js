"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
child_process_1.spawn(`node dist/src/cli.js`, {
    env: {
        NODE_PATH: "./dist",
    },
    shell: true,
});
