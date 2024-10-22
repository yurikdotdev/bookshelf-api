-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('CURRENTLY_READING', 'READ');

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

-- CreateTable
CREATE TABLE "Tag" (
    "uuid" UUID NOT NULL,
    "keywords" TEXT[],

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "BookTag" (
    "uuid" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "BookTag_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Status" (
    "uuid" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "status" "ReadingStatus" NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL,
    "is_reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Review" (
    "uuid" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "review" TEXT NOT NULL,
    "date_reviewed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
