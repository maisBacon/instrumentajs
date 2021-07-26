
# InstrumentaJS

Gerenciador de ferramentas para desenvolvedores JavaScript

## Instalação

Instale com npm

globalmente:
```bash
npm install -g instrumentajs
```
ou
localmente:
```bash
npm install --save-dev instrumentajs
```

## Exemplos de uso

Iniciar novo ambiente de desenvolvimento com configurações padrão 
```
npx instrumentajs init
```

Limpar todas as modificações feitas pelo InstrumentaJS
```
npx instrumenta clean
```  

Exibir referência da API
```
npx instrumenta help
```
## Referência da API
> Execute em um terminal:
`npx instrumentajs help`

## Roadmap

- Adicionar mais ferramentas padrão
- Adicionar testes
- Adicionar mais comandos
    - `dev` Executar ambiente de desenvolvimento
    - `add <plugin>` Integrar plugin ao ambiente de desenvolvimento
- Adicionar jest
- Adicionar ambiente para debugar local (compilar, rodar o node e fazer attach de debugger com docker e etc...)
- Trocar comando `clean` para `clear`
- Adicionar comando `drop` para limpar apagar somente o tools
  
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/dodiego/instrumentajs
```

Navegue até a pasta do projeto

```bash
  cd instrumentajs
```

Instale as dependências

```bash
  npm install
```

Compile e execute o arquivo javascript da CLI (dist/src/cli.js) 

```bash
  tsc && env NODE_PATH=./dist node dist/src/cli.js <init|config|clean>
```

  
## Reconhecimentos

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

  