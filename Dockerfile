FROM oven/bun:alpine as build-env

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:distroless

WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app .

COPY --from=build-env /usr/src/app/node_modules .

EXPOSE 3000

CMD [ "bun", "out" ]