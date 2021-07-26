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
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("src");
const commander_1 = require("commander");
const fs_1 = require("src/adapters/fs");
const config_1 = __importStar(require("src/config"));
(() => {
    commander_1.program.command("init").description("Iniciar novo espaço de trabalho").action(src_1.init);
    commander_1.program
        .command("config")
        .description("Adicionar arquivo de configuração padrão")
        .action(() => fs_1.writeJson(config_1.configFileName, config_1.default));
    commander_1.program.command("clean").description("Limpar todas as configurações").action(src_1.clean);
    commander_1.program.parse();
})();
