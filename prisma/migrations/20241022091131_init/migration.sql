-- CreateTable
CREATE TABLE "Author" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Book" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publisher" TEXT,
    "published_date" TIMESTAMP(3),
    "language" TEXT,
    "cover_image" TEXT,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Tag" (
    "uuid" TEXT NOT NULL,
    "keywords" TEXT[],

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "BookTag" (
    "uuid" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "BookTag_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Status" (
    "uuid" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL,
    "reviewed" BOOLEAN NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Review" (
    "uuid" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
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
