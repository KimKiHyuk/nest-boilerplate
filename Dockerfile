FROM node:14.15.3-alpine3.10 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . ./

RUN yarn install && \
    yarn run build:prod && \
    mkdir prod && \
    mv .*.env ./prod && \
    mv ./dist ./prod && \
    mv ./node_modules ./prod


FROM node:14.15.3-alpine3.10

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/prod /usr/src/app

ENV NODE_ENV=production

CMD [ "node", "dist/main.js" ]
