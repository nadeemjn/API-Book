"use client";
import { useState, useEffect } from "react";

export default function BookApp() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", available: true });
  const [updateBook, setUpdateBook] = useState<{ id: string | null; title: string; author: string; available: boolean }>({ id: null, title: "", author: "", available: true });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBooks = async () => {
    const response = await fetch("/api/books");
    const data = await response.json();
    setBooks(data);
  };

  const addBook = async () => {
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    fetchBooks();
    setNewBook({ title: "", author: "", available: true });
  };

  const updateExistingBook = async () => {
    if (updateBook.id) {
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBook),
      });
      fetchBooks();
      setUpdateBook({ id: null, title: "", author: "", available: true });
      setIsEditing(false);
    }
  };

  const deleteBook = async (id: string) => {
    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBooks();
  };

  const startEditing = (book: { id: string | null, title: string, author: string, available: boolean }) => {
    setUpdateBook(book);
    setIsEditing(true);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-4xl font-bold text-center text-blue-600">📚 Book Library</h1>

      {/* Book List */}
      <h2 className="text-2xl font-semibold text-gray-800">All Books</h2>
      <ul className="space-y-4">
        {books.map((book: { id: string, title: string, author: string, available: boolean }) => (
          <li key={book.id} className="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center">
            <span className="text-lg">{book.title} by {book.author} - <span className="font-semibold">{book.available ? "Available" : "Not Available"}</span></span>
            <div className="flex space-x-2">
              <button onClick={() => startEditing(book)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Edit
              </button>
              <button onClick={() => deleteBook(book.id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add or Update Book Form */}
      <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? "Update Book" : "Add a New Book"}</h2>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Book Title" 
            value={isEditing ? updateBook.title : newBook.title} 
            onChange={e => isEditing ? setUpdateBook({ ...updateBook, title: e.target.value }) : setNewBook({ ...newBook, title: e.target.value })}
            className="p-3 border border-gray-300 rounded-md w-full sm:w-1/2"
          />
          <input 
            type="text" 
            placeholder="Author" 
            value={isEditing ? updateBook.author : newBook.author} 
            onChange={e => isEditing ? setUpdateBook({ ...updateBook, author: e.target.value }) : setNewBook({ ...newBook, author: e.target.value })}
            className="p-3 border border-gray-300 rounded-md w-full sm:w-1/2"
          />
        </div>

        <button 
          onClick={isEditing ? updateExistingBook : addBook} 
          className={`w-full sm:w-auto py-3 px-6 font-semibold text-white rounded-md transition-colors ${isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isEditing ? "Update Book" : "Add Book"}
        </button>
      </div>
    </div>
  );
}
