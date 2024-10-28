import prisma from '../db';
import { Author } from '../types/Authors';

export const getAllAuthors = async (): Promise<Author[]> => {
  return await prisma.author.findMany({
    include: {
      books: true,
    },
  });
};

export const getAuthorById = async (id: string): Promise<Author | null> => {
  return await prisma.author.findUnique({
    where: { id },
    include: { books: true },
  });
};

export const createAuthor = async (name: string): Promise<Author> => {
  return await prisma.author.create({
    data: {
      name,
    },
    include: { books: true },
  });
};

export const updateAuthor = async (
  id: string,
  name: string
): Promise<Author> => {
  return await prisma.author.update({
    where: { id },
    data: { name },
  });
};

export const deleteAuthor = async (id: string): Promise<Author> => {
  return await prisma.$transaction(async (tx) => {
    await tx.book.deleteMany({ where: { author_id: id } });
    return await tx.author.delete({ where: { id } });
  });
};
