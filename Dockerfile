FROM oven/bun:latest

WORKDIR /app

COPY .  /app

RUN bun install

COPY prisma ./prisma

COPY . .

RUN bunx prisma generate

RUN sleep 5

CMD ["bun", "start:migrate"]