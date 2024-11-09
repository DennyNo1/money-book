import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { addField, getAllFields, addDoc, getAllDocs } from "../api/table";

export default function MoneyTable() {
  //添加字段的弹窗的开关
  const [showModal, setShowModal] = useState(false);
  //添加字段的输入框
  const [input, setInput] = useState([]);

  //所有字段或者叫列组成的数组
  const [allFields, setAllFields] = useState([]);
  const [docs, setDocs] = useState([]);

  const [showInput, setShowInput] = useState(false);

  const [inputValues, setInputValues] = useState(
    Array(allFields.length).fill("")
  ); // 初始值为空
  //从url获取collectionName
  const { name } = useParams();

  const [sendInput, setSendInput] = useState([{}]);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      console.error("Input is empty.");
      alert("Please enter a book name.");
      return;
    }
    try {
      const response = await addField({ field: input, collection: name });

      if (response.status !== 200) {
        alert(response.data.message);
        handleCloseModal();
        return;
      }

      //console.log(" added successfully!");
      handleCloseModal();
      fetchFields();
      setInput(""); // Clear the input after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      //alert("There was an error adding the book. Please try again.");
    }
  };
  //从后端获取最新所有字段并更新到页面
  const fetchFields = async () => {
    try {
      //对后端传过来的数据进行处理
      const { data } = await getAllFields(name);
      //获取只有fieldName的对象的数组。但我觉得没必要
      const newArr = data.data.map((item) => item.fieldName);
      setAllFields(newArr);
    } catch (error) {
      console.error("Error fetching table:", error);
    }
  };

  //从后端获取最新所有doc并更新到页面
  const fetchDocs = async () => {
    try {
      //对后端传过来的数据进行处理
      const { data } = await getAllDocs(name);
      console.log(data);
      // const newArr = data.data.map((item) => item.doc);
      setDocs(data.data);
    } catch (error) {
      console.error("Error fetching docs:", error);
    }
  };

  const handleAddRow = () => {
    setShowInput(!showInput);
  };
  //向后端提交一行数据
  const handleSubmitRow = async () => {
    console.log(inputValues);
    try {
      const response = await addDoc({
        collection: name,
        doc: sendInput,
      });

      if (response.status !== 200) {
        alert(response.data.message);
        return;
      }
      setInputValues(Array(allFields.length).fill(""));
      setShowInput(false);
      fetchDocs();
    } catch (error) {
      console.error("Error fetching table:", error);
    }
  };

  useEffect(() => {
    fetchFields();
    fetchDocs();
  }, []);

  const handleInputChange = (index, value, field) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    const newSendInput = [...sendInput];
    newSendInput[index] = { field, value };
    setInputValues(newValues);
    setSendInput(newSendInput);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center ">
      {/* 表格 */}
      <div className="flex  flex-col max-w-full p-20">
        <div className="table w-full shadow-lg rounded-lg overflow-hidden bg-white">
          {/* 表格头 */}
          <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white">
            <div className="table-row">
              {allFields.map((item, index) => (
                <div
                  key={index}
                  className="table-cell p-6 border-r border-gray-300 last:border-none text-center"
                >
                  <h2 className="text-xl font-semibold">{item}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* 表格行 */}
          <div className="table-row-group">
            {docs.map((item, rowIndex) => (
              <div key={rowIndex} className="table-row ">
                {item.doc.map((cell, index) => (
                  <div
                    key={index}
                    className="table-cell p-6 border-gray-300 text-center border-y-2  max-w-lg break-words"
                  >
                    <h2 className="text-xl font-semibold max-w-lg break-words">
                      {cell.value}
                    </h2>
                  </div>
                ))}

                {/* 渲染空白单元格 */}
                {Array.from({ length: allFields.length - item.doc.length }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="table-cell p-6 border-gray-300 text-center border-y-2"
                    >
                      {/* 空白内容 */}
                    </div>
                  )
                )}
              </div>
            ))}

            {/* 新增行 */}
            {showInput && (
              <div className="table-row">
                {allFields.map((item, index) => (
                  <div className="table-cell p-4 border-gray-300 text-center border-y-2">
                    <textarea
                      className="text-xl font-semibold w-full max-w-[150px] p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Please input "
                      rows="1"
                      onInput={(e) => {
                        e.target.style.height = "auto"; // 重置高度
                        e.target.style.height = `${e.target.scrollHeight}px`; // 设置为内容高度
                      }}
                      style={{
                        overflow: "hidden", // 隐藏滚动条
                      }}
                      value={inputValues[index]} // 绑定输入框的值
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e.target.value,
                          allFields[index]
                        )
                      } // 更新状态
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 按钮组 */}
        <div className="  flex mt-2 justify-between">
          <div>
            {!showInput ? (
              <div
                onClick={handleAddRow}
                className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 "
              >
                ➕
              </div>
            ) : (
              <div
                onClick={handleAddRow}
                className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 "
              >
                ➖
              </div>
            )}
          </div>
          {showInput && (
            <div className="flex space-x-4  ">
              {/* <div
                onClick={handleAddRow}
                className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110  "
              >
                ❌
              </div> */}
              <div
                onClick={handleSubmitRow}
                className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110  "
              >
                ✔
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加列按钮 */}
      <div className="absolute top-10 right-6">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Add New Field
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
                  <label className="block text-gray-700">New Field</label>
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
