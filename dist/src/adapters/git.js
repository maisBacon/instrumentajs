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
    if (!fs_1.default.existsSync(".git")) {
        await child_process_1.promisifyChildProcess(child_process_1.spawnChildProcess("git init"));
    }
}
exports.assertGitInit = assertGitInit;
async function assertGitIgnore() {
    const gitIgnoreContent = "node_modules";
    await fs_2.assertFile(".gitignore", gitIgnoreContent);
}
exports.assertGitIgnore = assertGitIgnore;
