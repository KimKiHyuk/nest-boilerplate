FROM node:14.15.3-alpine3.10 AS builder

WORKDIR /usr/src/app

COPY yarn.lock package.json tsconfig.build.json tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build:prod && \
    mkdir prod && \
    mv .*.env ./prod && \
    mv ./dist ./prod && \
    mv ./node_modules ./prod

FROM node:14.15.3-alpine3.10

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/prod /usr/src/app

ENV NODE_ENV=development

CMD [ "node", "dist/main.js" ]
