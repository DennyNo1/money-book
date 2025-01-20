import React, { useState, useEffect } from "react";
import { addBook, getAllBooks, deleteBook } from "../api/book";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import BackHome from "../components/BackHome";
function MoneyBook() {
  const navigate = useNavigate(); //路由跳转
  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState([]);
  const [input, setInput] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = (book) => {
    console.log("delete");
    setSelectedBook(book);
    setShowDeleteModal(true);
  };
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
      // console.log(data);
      setBooks(data);
    } catch (error) {
      setError("Error fetching books");
    }
  };

  const confirmDelete = async () => {
    // 执行删除逻辑
    console.log(`Deleting book: ${selectedBook}`);
    setShowDeleteModal(false);
    setSelectedBook(null);
    // 在这里调用删除 API 或从状态中移除书本

    await deleteBook(selectedBook);
    fetchBooks();
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
      {/* book区域 */}
      <div className="flex items-center justify-center gap-4 p-4">
        {books.map((book, index) => (
          <div
            className="border w-48 h-64 bg-white shadow-lg rounded-md p-4 flex flex-col justify-between items-center border-gray-300 transition-transform duration-300 transform hover:scale-105 relative"
            key={index}
          >
            <img
              src="/cover.svg"
              onClick={() => navigate(`/moneybook/${book.name}`)}
            ></img>
            <h2
              className="font-semibold text-gray-800 cursor-pointer my-8"
              onClick={() => navigate(`/moneybook/${book.name}`)}
            >
              {book.name}
            </h2>
            {/* 删除按钮 */}
            <button
              onClick={() => handleDelete(book.name)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold text-2xl"
            >
              &times;
            </button>
            <div
              className="w-full h-full  "
              onClick={() => navigate(`/moneybook/${book.name}`)}
            ></div>
          </div>
        ))}
      </div>

      {/* 新增书本 */}
      <div className="absolute top-10 right-6">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Add New Book
        </button>
      </div>

      {/* 添加书本的弹窗 */}
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

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-800 font-semibold mb-4">
              Are you sure you want to delete '{selectedBook?.name}'?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <BackHome></BackHome>
    </div>
  );
}

export default MoneyBook;
