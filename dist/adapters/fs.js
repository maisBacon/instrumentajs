"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToolIndex = exports.writeJson = exports.assertDefaultConfig = exports.assertDirectory = exports.assertFile = void 0;
const config_1 = __importDefault(require("src/config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const assertFile = async (file, defaultContent) => {
    try {
        await fs_1.default.promises.stat(file);
    }
    catch (error) {
        await fs_1.default.promises.writeFile(file, defaultContent);
    }
};
exports.assertFile = assertFile;
const assertDirectory = async (dir) => {
    try {
        await fs_1.default.promises.stat(dir);
    }
    catch (error) {
        await fs_1.default.promises.mkdir(dir, { recursive: true });
    }
    return true;
};
exports.assertDirectory = assertDirectory;
const assertDefaultConfig = async () => {
    const file = "instrumenta.json";
    const defaultContent = JSON.stringify(config_1.default, null, 2);
    exports.assertFile(file, defaultContent);
};
exports.assertDefaultConfig = assertDefaultConfig;
const writeJson = async (path, json) => {
    return fs_1.default.promises.writeFile(path, JSON.stringify(json, null, 2));
};
exports.writeJson = writeJson;
const writeToolIndex = async (tool) => {
    const line1 = `export const name = "${tool.name}"`;
    const line2 = `export const configFileName = "${tool.configFileName}"`;
    const content = [line1, line2].join("\n");
    return fs_1.default.promises.writeFile(path_1.default.join("tools", tool.category, tool.name, "index.ts"), content);
};
exports.writeToolIndex = writeToolIndex;
