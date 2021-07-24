import { init, runDev, assertConfig, clean } from "."
import { program } from "commander"
;(() => {
  program.command("init").description("Iniciar novo espaço de trabalho").action(init)
  program.command("dev").description("Iniciar ambiente de desenvolvimento").action(runDev)
  program.command("config").description("Adicionar arquivo de configuração padrão").action(assertConfig)
  program.command("clean").description("Limpar todas as configurações").action(clean)

  program.parse()
})()
