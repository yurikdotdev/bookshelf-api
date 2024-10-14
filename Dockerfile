FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
COPY src ./

RUN bun install

COPY src ./src

CMD ["bun", "start"] 