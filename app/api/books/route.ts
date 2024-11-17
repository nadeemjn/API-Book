// app/api/books/route.tsx
import { NextResponse } from "next/server";

// Simulate a database
let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling", available: true },
];

// GET method to fetch all books
export async function GET() {
  try {
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching books" }, { status: 500 });
  }
}

// POST method to add a new book
export async function POST(request: Request) {
  try {
    const newBook = await request.json();
    newBook.id = books.length + 1;
    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding book" }, { status: 500 });
  }
}

// PUT method to update a book by ID
export async function PUT(request: Request) {
  try {
    const { id, title, author, available } = await request.json();
    const book = books.find(b => b.id === id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.available = available ?? book.available;
      return NextResponse.json(book, { status: 200 });
    } else {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error updating book" }, { status: 500 });
  }
}

// DELETE method to delete a book by ID
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const index = books.findIndex(b => b.id === id);

    if (index !== -1) {
      books.splice(index, 1);
      return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}
