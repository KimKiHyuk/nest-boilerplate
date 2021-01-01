FROM node:14.15.3-alpine3.10 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . ./

RUN yarn install && \
    yarn run build:prod

FROM node:14.15.3-alpine3.10

RUN mkdir -p /usr/src/prod
WORKDIR /usr/src/prod

COPY --from=builder /usr/src/app/.production.env /usr/src/prod
COPY --from=builder /usr/src/app/dist /usr/src/prod/dist
COPY --from=builder /usr/src/app/node_modules /usr/src/prod/node_modules

ENV NODE_ENV=production
CMD [ "node", "dist/main.js" ]
