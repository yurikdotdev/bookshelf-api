-- CreateTable
CREATE TABLE "Author" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Book" (
    "uuid" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "publisher" VARCHAR(255),
    "published_date" TIMESTAMP(3),
    "language" VARCHAR(100),
    "cover_image" TEXT,
    "author_id" UUID NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
