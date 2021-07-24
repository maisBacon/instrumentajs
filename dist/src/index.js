"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = exports.init = void 0;
const child_process_1 = require("src/adapters/child_process");
const fs_1 = require("src/adapters/fs");
const config_1 = __importStar(require("src/config"));
const fs_2 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const git_1 = require("./adapters/git");
async function addTool(config, tool) {
    const packages = [tool.name, ...tool.dependencies].filter((x) => x).join(" ");
    const toolDirectory = path_1.default.join(config.toolsDirectory, tool.category, tool.name);
    await fs_1.assertDirectory(toolDirectory);
    await child_process_1.promisifyChildProcess(child_process_1.spawnChildProcess(`${config.packageManager.name} ${config.packageManager.addCommand} ${packages}`));
    await fs_1.writeToolIndex(tool);
    if (tool.configFileName && tool.configFileContent) {
        if (tool.configFileContent === "string") {
            await fs_1.assertFile(tool.configFileName, tool.configFileContent);
        }
        else {
            await fs_1.writeJson(tool.configFileName, tool.configFileContent);
        }
    }
}
async function uninstallTool(config, tool) {
    const packages = [tool.name, ...tool.dependencies].filter((x) => x).join(" ");
    await child_process_1.promisifyChildProcess(child_process_1.spawnChildProcess(`${config.packageManager.name} ${config.packageManager.removeCommand} ${packages}`));
}
async function init() {
    if (fs_2.default.existsSync(config_1.configFileName)) {
        console.log(`Espaço de trabalho já foi iniciado`);
        return;
    }
    await fs_1.writeJson(config_1.configFileName, config_1.default);
    const configBuffer = await fs_2.default.promises.readFile(config_1.configFileName);
    const config = JSON.parse(configBuffer.toString());
    await Promise.all([git_1.assertGitInit(), git_1.assertGitIgnore()]);
    for (const tool of config_1.default.tools) {
        await addTool(config, tool);
    }
}
exports.init = init;
async function clean() {
    if (!fs_2.default.existsSync(config_1.configFileName)) {
        console.log(`Espaço de trabalho não foi iniciado`);
        return;
    }
    const configBuffer = await fs_2.default.promises.readFile(config_1.configFileName);
    const config = JSON.parse(configBuffer.toString());
    await fs_2.default.promises.rm(config_1.default.toolsDirectory, {
        recursive: true,
        force: true,
    });
    await fs_2.default.promises.rm(config_1.configFileName, { force: true });
    for (const tool of config_1.default.tools) {
        await uninstallTool(config, tool);
    }
}
exports.clean = clean;
