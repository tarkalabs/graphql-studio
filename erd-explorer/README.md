# <img src="resources/postgres-explorer.svg" width="48" style="position: absolute"><div style="padding:1px 0px 0px 60px">ERD Explorer<div/> 

`Erd Explorer` is the simplest way to debug massive postgresql databases.

![DEMO-1.gif](resources/gifs/DEMO-1.gif)
Designed for use in Visual Studio Code

### Usage
---
Automatically connects to existing postgresql databases using connection options defined in the environment.
Supports use of local environment files `.env` and `.envrc`.
Once connected the explorer window allows developers to view the structure of the database through a beautiful tree structure modified from [VSCode-Postgres](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres) as well as an interactable generated ER Diagram using [Mermaid](https://www.npmjs.com/package/mermaid)

### Installation Options
---
1. Install using the Visual Studio Marketplace
    + Search for `Erd-Explorer` in vscode and install
2. Install Manually
    + Download the latest release `erd-explorer.vsix` file.
    + Run `code erd-explorer.vsix` to install it in your `.vscode/extensions` folder
    + Alternatively you can drop `erd-explorer.vsix` inside `.vscode/extensions` manually

### Configuration
---
1. Readable Environments
    + Erd-Explorer reads database connections from the environment variables
    + Erd-Explorer supports `.env` and `.envrc` files in the root directory of your project
    + `DATABASE_URI` will always override any other connection options
2. Environment Variables
    + PGLABEL: Custom label to show when database is successfully connected. ex: `Localhost`
    + DATABASE_URI: A valid database uri will override all options below. ex: `postgres://postgres:postgres@127.0.0.1:5432/postgres`
    + PGHOST: Host of the server. ex: `127.0.0.1`
    + PGUSER: Postgres User to use for the connection ex: `postgres`
    + PGPASSWORD: (optional) Use this password instead of the current default for the connection. ex: `postgres`
    + PGPORT: Host port for the postgresql server. ex: `5432`
    + PGDATABASE: Database to connect to. ex: `postgres`

### Local Development
---
1. Clone repository and checkout a branch
2. Create `.env` or `.envrc` files if connection options are not present in the environment
3. cd into `erd-explorer`
4. run `npm install`
5. run `npm run watch`
6. Press `F5` or launch the extension debugger.

### Credits
---
This extension was made possible by the following open source packages:
- [Bootstrap](https://www.npmjs.com/package/bootstrap)
- [JQuery](https://www.npmjs.com/package/jquery)
- [VSCode-Postgres](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)
- [Mermaid](https://www.npmjs.com/package/mermaid)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Dotenvrc](https://www.npmjs.com/package/dotenvrc)
- [Pg-Connection-String](https://www.npmjs.com/package/pg-connection-string)
- [Popper.js](https://www.npmjs.com/package/popper.js/v/1.16.1)

### License
---
APACHE 2.0
Copyright 2020 TarkaLabs

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.