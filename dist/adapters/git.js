"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertGitIgnore = exports.assertGitInit = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("./child_process");
const fs_2 = require("./fs");
async function assertGitInit() {
    try {
        await fs_1.default.promises.stat(".git");
    }
    catch (error) {
        await child_process_1.promisifyChildProcess(child_process_1.spawnChildProcess("git init"));
    }
}
exports.assertGitInit = assertGitInit;
async function assertGitIgnore() {
    const gitIgnoreContent = ["node_modules", "dist"].join("\n");
    await fs_2.assertFile(".gitignore", gitIgnoreContent);
}
exports.assertGitIgnore = assertGitIgnore;
