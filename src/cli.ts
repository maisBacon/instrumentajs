import { init, runDev } from "."
import { program } from "commander"
;(() => {
  program.command("init").description("Iniciar novo espaço de trabalho").action(init)
  program.command("dev").description("Iniciar ambiente de desenvolvimento").action(runDev)

  program.parse()
})()
