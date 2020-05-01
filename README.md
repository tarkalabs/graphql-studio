# GraphQL Studio

GraphQL studio is a set of command line tools and VSCode extensions to simplify the job of creating GraphQL servers. GraphQL Studio is a temporary name and we need to come up with a better name for this.

## Inspiration

This product will compete directly with Hasura. Hasura allows you to model your databases via a web browser but does not offer much in terms of customzations. This is a pain when it comes to complex real world projects. Rather than being a library Hasura intends to be a framework around which the control and the logic of the project would be woven. While I understand Hasura's need to be at that position, it is results in bad developer experience and forces developers into solutions like GraphQL gateway or other services even for simple extensions to the GraphQL schema.

[Postgraphile](https://www.graphile.org/postgraphile/) is distributed under the MIT license and provides a better way to customize both on the SQL side as well on the Javascript side of the equation. This means that we should be able to build fairly big monoliths without having to break it into micro-services. While this might fly at the face of the current trends of building a lot of microservices, I think it is the perfect sweet spot for enterprise applications which are largely CRUD based.

However, Postgrapile in its current form is a simple library and leaves a lot of decisions to its users. The tools in this project will provide an opinionated way of organizing a postgraphile project.

## Generator

Studio will ship with a generator that can be used to bootstrap a project. The generator will setup an express server with postgraphile configured for both development and production modes, setup JWT secrets and a migration directory using [sqitch](https://sqitch.org/). It will also setup a Docker Compose configuration for the database, migrations and the graphql server. It will also setup sample test cases that will allow testing PostgreSQL functions with javascript.

## Plugins

We will also ship with a number of postgraphile plugins that will support 

* Authentication - Passport, Okta, AWS Cognito, Google Identity Platform etc
* Search - implement postgresql full text search and elastic search based queries
* Metrics - Prometheus, Cloudwatch, Google Cloud Metrics
* Tracing - OpenTracing compatible tracing
* File Uploads - Local, S3, back blaze, et al

## Deployment Integration

We will write exporters to export the application to be deployed on to Heroku, AWS ECS task definitions, Kubernetes deployment manifests.

## Editor Integration

While we'll do our efforts to integrate with most IDEs, our MVP will be on VSCode. The VSCode extension integrate with the generator to provide IDE level commands to generate tables and functions. It will also provide a visual modeller to explore and change the database visually using generated ERDs or drilling down to functions or organizing policies and such. 

TODO: mock ups here

## Tech stack

* Go for the generator and the command line tool
* Typescript for VSCode integration