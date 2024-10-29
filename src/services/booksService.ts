import prisma from '../db';
import { Book } from '../types/Books';

export const getAllBooks = async (): Promise<Book[]> => {
  return await prisma.book.findMany({
    include: {
      author: true,
    },
  });
};

export const getBookById = async (id: string): Promise<Book | null> => {
  return await prisma.book.findUnique({
    where: {
      id
    },
    include: {
      author: true,
    },
  });
};

export const createBook = async (data: Omit<Book, 'id'>): Promise<Book> => {
  return await prisma.book.create({
    data,
    include: { author: true },
  });
};

export const updateBook = async (id: string, data: Partial<Book>): Promise<Book | null> => {
  return await prisma.book.update({
    where: { id },
    data,
    include: { author: true },
  })
}

export const deleteBook = async (id: string): Promise<Book | null> => {
  return await prisma.book.delete({
    where: {
      id
    }
  })
};
