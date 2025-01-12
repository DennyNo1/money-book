import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Drawer } from "antd";
import {
  addField,
  getAllFields,
  addDoc,
  getAllDocs,
  updateDoc,
} from "../api/table";

import CSTable from "../components/CSTable";
import CashTable from "../components/CashTable";
import BackHome from "../components/BackHome";
import { EditTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CalculateDrawer from "../components/CalculateDrawer";
export default function MoneyTable() {
  const navigate = useNavigate();
  //添加字段的弹窗的开关
  const [showModal, setShowModal] = useState(false);

  //添加字段的输入框
  const [input, setInput] = useState([]);

  //所有字段组成的数组
  const [allFields, setAllFields] = useState([]);

  const [showDrawer, setShowDrawer] = useState(false);
  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const [docs, setDocs] = useState([]);

  const [showInput, setShowInput] = useState(false);

  //row输入框的显示值
  const [inputValues, setInputValues] = useState(
    Array(allFields.length).fill("")
  ); // 初始值为空

  //从url获取collectionName.这个解构出来的name是固定的，无法改成collectionname。
  const { name } = useParams();

  //
  const [showEdit, setShowEdit] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [editIndex, setEditIndex] = useState({ field: "", docIndex: "" });

  const [newEditValue, setNewEditValue] = useState("");

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const options = [
    { value: "string", label: "String" },
    { value: "number", label: "Nubmer" },
    { value: "date", label: "Date" },
  ];
  //添加field
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(selectedValue);
    const type = selectedValue;

    //required自动判定是否为空
    try {
      console.log(type);
      const response = await addField({
        field: input,
        collection: name,
        type: type,
      });

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
      console.log(name);
      //对后端传过来的数据进行处理
      const { data } = await getAllFields(name);

      //获取只有fieldName的对象的数组。但我觉得没必要

      setAllFields(data.data);
    } catch (error) {
      console.error("Error fetching table:", error);
    }
  };

  //从后端获取最新所有doc并更新到页面
  const fetchDocs = async () => {
    try {
      //对后端传过来的数据进行处理

      const { data } = await getAllDocs(name, "asc", "Buy Date");
      setDocs(data.data);
    } catch (error) {
      console.error("Error fetching docs:", error);
    }
  };

  const handleAddRow = () => {
    setShowInput(!showInput);
  };
  //向后端新建一行数据
  const handleSubmitRow = async () => {
    //根据inputValues生成sendInput
    const doc = {};
    for (let i = 0; i < allFields.length; i++) {
      doc[allFields[i].field] = inputValues[i];
    }
    try {
      const response = await addDoc({
        collection: name,
        doc: doc,
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

  //输入值改变时，InputValues更新，同时更新sendInput。这是新增输入框。
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const clickEditCell = (docIndex, field) => {
    const newIndex = {};
    newIndex.docIndex = docIndex;
    newIndex.field = field;
    console.log(newIndex);
    setEditIndex(newIndex);
    setShowEdit(false);
  };
  async function handleEditCell(docIndex, field) {
    const newDoc = docs[docIndex];

    newDoc[field] = newEditValue;
    console.log(newDoc);
    await updateDoc({
      collection: name,
      doc: newDoc,
    });
    fetchDocs();

    //关闭编辑输入框
    setEditIndex({ field: "", docIndex: "" });
    setNewEditValue("");
  }

  const tableComponents = {
    CS: <CSTable docs={docs} />,
    Cash: <CashTable docs={docs} />,
  };

  const setCalculated = () => {};

  // 使用 useState 来管理 input 列表
  const [inputs, setInputs] = useState([]);
  const [calculatedFields, setCalculatedFields] = useState([]);

  //每次往数组中先添加一个对象，来表示当前的所有的选择框
  const addCalculatedFields = () => {
    setCalculatedFields([...calculatedFields, {}]);
  };

  // 处理 input 值变化的函数
  const handleInputsChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };
  return (
    <div className="min-h-screen min-w-screen  bg-gradient-to-r from-green-100 to-white flex  justify-center  border-4 flex-col">
      {/* 表格组*/}
      <div className="flex flex-row max-w-full px-10 ">
        {/* 主表格 */}
        <div className="table w-auto max-h-[500px] overflow-auto shadow-lg  bg-white ml-20">
          {/* 表格头 */}
          <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white ">
            <div className="table-row">
              {allFields.map((item, index) => (
                <div
                  key={index}
                  className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap "
                >
                  <h2 className=" font-semibold">{item.field}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* //docs是数组，doc是对象 */}
          {/* 展示的表格行 */}
          <div className="table-row-group overflow-x-auto">
            {docs.length > 0 &&
              docs.map((doc, docIndex) => (
                <div key={docIndex} className="table-row">
                  {allFields.map((item, index) => (
                    <div
                      key={index}
                      className="table-cell p-3 border-gray-300 text-center border-y-2 whitespace-nowrap overflow-hidden "
                    >
                      {!(
                        editIndex.field === item.field &&
                        editIndex.docIndex === docIndex
                      ) ? (
                        <h2 className="">
                          {doc[item.field]}{" "}
                          {showEdit && (
                            <EditTwoTone
                              twoToneColor="#a6a6a6"
                              onClick={() => {
                                clickEditCell(docIndex, item.field);
                              }}
                            />
                          )}
                        </h2>
                      ) : (
                        <div>
                          <input
                            className=" w-full max-w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none whitespace-nowrap"
                            placeholder="Please input new Value"
                            value={newEditValue}
                            rows="1"
                            style={{
                              overflow: "hidden", // 隐藏滚动条
                            }}
                            onChange={(e) => setNewEditValue(e.target.value)}
                          ></input>
                          <div className="flex flex-row justify-between">
                            <div
                              onClick={() =>
                                setEditIndex({ field: "", docIndex: "" })
                              }
                              className="w-10 h-10  text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
                            >
                              ❌
                            </div>
                            <div
                              onClick={() =>
                                handleEditCell(docIndex, item.field)
                              }
                              className="w-10 h-10  text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
                            >
                              ✔
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

            {/* 新增行 */}
            {showInput && (
              <div className="table-row ">
                {allFields.map((item, index) => (
                  <div
                    className="table-cell p-3 text-center border-y-2"
                    key={index}
                  >
                    <div className="flex justify-center items-center">
                      {
                        item.field.toLowerCase().includes("date") ? (
                          <input
                            type="date"
                            className="  w-full max-w-fit p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={inputValues[index]}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                          />
                        ) : (
                          // !(
                          //     item.toLowerCase().includes("price") ||
                          //     item.toLowerCase().includes("income") ||
                          //     item.toLowerCase().includes("amount")
                          //   ) ?
                          <textarea
                            className=" w-full max-w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none whitespace-nowrap"
                            placeholder="Please input"
                            rows="1"
                            style={{
                              overflow: "hidden", // 隐藏滚动条
                            }}
                            value={inputValues[index]} // 绑定新增输入框的值
                            onChange={(e) => {
                              e.target.style.height = "auto"; // 重置高度
                              e.target.style.height = `${e.target.scrollHeight}px`; // 设置为内容高度
                              handleInputChange(index, e.target.value);
                              e.target.value = e.target.value.replace(
                                /\n/g,
                                ""
                              );
                              console.log(e.target.value);
                            }} // 更新状态
                          ></textarea>
                        )
                        // : (
                        //   <input
                        //     type="number"
                        //     className=" w-full max-w-fit p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        //     value={inputValues[index]}
                        //     onChange={(e) =>
                        //       handleInputChange(
                        //         index,
                        //         e.target.value,
                        //         allFields[index]
                        //       )
                        //     }
                        //   />
                        // )
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>{" "}
        <div className="ml-4">{tableComponents[name]}</div>
      </div>

      {/* 按钮组 */}
      <div className="   flex px-20 py-2">
        <div>
          {!showInput ? (
            <div
              onClick={handleAddRow}
              className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            >
              ➕
            </div>
          ) : (
            <div
              onClick={handleAddRow}
              className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            >
              ➖
            </div>
          )}
        </div>
        {showInput && (
          <div className="flex space-x-4 border-2">
            <div
              onClick={handleSubmitRow}
              className="w-10 h-10 bg-purple-600 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            >
              ✔
            </div>
          </div>
        )}
      </div>

      <BackHome></BackHome>

      {/* 按钮组 */}
      <div className="absolute top-10 right-6">
        {/* 编辑表格 */}
        <button
          onClick={() => {
            setShowEdit(!showEdit);
          }}
          className="px-6 py-3 mx-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Edit
        </button>
        {/* 计算drawer */}
        <button
          onClick={() => {
            setShowDrawer(true);
          }}
          className="px-6 py-3 mx-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Calculate
        </button>
        {/* 新增field */}
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Add New Field
        </button>
      </div>
      <CalculateDrawer
        showDrawer={showDrawer}
        closeDrawer={closeDrawer}
        allFields={allFields}
        docs={docs}
      ></CalculateDrawer>

      {/* 添加field的弹窗 */}
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
                  <select
                    id="options"
                    value={selectedValue}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
                    required
                  >
                    <option value="" disabled>
                      Please select the type of new field
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2  bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
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
