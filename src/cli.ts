import { init, clean } from "."
import { program } from "commander"
import { writeJson } from "./adapters/fs"
import defaultConfigs, { configFileName } from "./config"
;(() => {
  program.command("init").description("Iniciar novo espaço de trabalho").action(init)
  program
    .command("config")
    .description("Adicionar arquivo de configuração padrão")
    .action(() => writeJson(configFileName, defaultConfigs))
  program.command("clean").description("Limpar todas as configurações").action(clean)

  program.parse()
})()
