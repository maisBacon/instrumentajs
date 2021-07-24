"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const commander_1 = require("commander");
(() => {
    commander_1.program.command("init").description("Iniciar novo espaço de trabalho").action(_1.init);
    commander_1.program
        .command("config")
        .description("Adicionar arquivo de configuração padrão")
        .action(_1.assertConfig);
    commander_1.program.command("clean").description("Limpar todas as configurações").action(_1.clean);
    commander_1.program.parse();
})();
