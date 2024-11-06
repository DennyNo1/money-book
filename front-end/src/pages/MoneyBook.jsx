import React, { useState, useEffect } from "react";
import { addBook, getAllBooks } from "../api/book";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
function MoneyBook() {
  const navigate = useNavigate(); //路由跳转
  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState([]);
  const [input, setInput] = useState([]);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  //submit add new book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      console.error("Input is empty.");
      alert("Please enter a book name.");
      return;
    }
    try {
      const response = await addBook({ name: input });

      if (response.status !== 200) {
        alert(response.data.message);
        handleCloseModal();
        return;
      }

      console.log("Book added successfully!");
      handleCloseModal();
      fetchBooks();
      setInput(""); // Clear the input after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error adding the book. Please try again.");
    }
  };
  const fetchBooks = async () => {
    try {
      const { data } = await getAllBooks();
      console.log(data);
      setBooks(data);
    } catch (error) {
      setError("Error fetching books");
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
      <Outlet />
      {/* book区域 */}
      <div className="flex items-center justify-center gap-4 p-4 ">
        {books.map((book, index) => (
          <div
            onClick={() => navigate(`/moneybook/${book.name}`)}
            className="border w-48 h-64 bg-white shadow-lg rounded-md p-4 flex flex-col justify-between items-start border-gray-300 transition-transform duration-300 transform hover:scale-105"
            key={index}
          >
            <h3 className="font-semibold text-gray-800">{book.name}</h3>
            {/* <span className="text-sm text-gray-500">Record details here</span> */}
          </div>
        ))}
      </div>

      {/* 按钮区域 */}
      <div className="absolute top-4 right-6">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Add New Book
        </button>
      </div>

      {/* 弹窗 */}
      <div className="flex items-center justify-center">
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Book Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                    required
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoneyBook;
