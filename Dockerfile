FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
COPY prisma ./prisma
COPY src ./src

RUN bun install && bunx prisma generate

CMD ["bun", "start:migrate"]