import { init, runDev } from "."
import inquirer from "inquirer"

async function initialPrompt(): Promise<inquirer.Answers> {
  return inquirer.prompt([
    {
      name: "action",
      message: "Specify an action",
      type: "list",
      choices: ["init", "execute task"],
    },
  ])
}

async function run() {
  const initialChoice = await initialPrompt()
  if (initialChoice.action === "init") {
    await init()
  } else {
    const choice = await inquirer.prompt([
      {
        name: "task",
        message: "Specify a task",
        type: "list",
        choices: ["run dev"],
      },
    ])
    if (choice.task === "run dev") {
      runDev()
    }
  }
}

if (!process.argv[2]) {
  run()
}
