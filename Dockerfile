FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY prisma ./prisma

COPY . .

RUN bunx prisma generate

CMD ["bun", "start:migrate"]