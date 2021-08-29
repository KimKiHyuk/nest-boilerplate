# Nest.js boilerplate

powered by

[![Awesome NestJS](https://img.shields.io/badge/Awesome-NestJS-blue.svg?longCache=true&style=flat-square)](https://github.com/juliandavidmr/awesome-nestjs)


## Getting started
* NODE_ENV로 알맞은 개발환경을 설정합니다. (default : development)
* yarn install
* yarn run start:dev


## Migration
* yarn typeorm migration:generate -n migrations/<what-you-want>
* yarn typeorm migration:run
* yarn typeorm migration:show


## features
* Admin
    * yarn run start:admin


## Debug
* yarn run debug:dev
* F5 // Only for vscode (you have to assign 9229 debugging port in .vscode)
