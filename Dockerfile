FROM node:20.16-alpine3.20 AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY . .
RUN yarn --frozen-lockfile && yarn build


FROM node:20.16-alpine3.20 AS development
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

