//设计上，我觉得没必要像moneybook动态增加field以及划分出多个book。为了区分开以及节省时间，直接用一个table来表示。
import React from "react";
import { useEffect, useState } from "react";
import { EditOutlined, EditTwoTone, HomeOutlined } from "@ant-design/icons";
import BackHome from "../components/BackHome";
import { addDoc, getAllDocs } from "../api/code";
export default function Code() {
  //
  const [allFields, setAllFields] = useState([
    "from",
    "username",
    "password",
    "note",
  ]);
  //除了表格头的所有行，从数据库获取
  const [docs, setDocs] = useState([]);
  const [editIndex, setEditIndex] = useState({ field: "", docIndex: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [newEditValue, setNewEditValue] = useState("");
  //row输入框的显示值
  const [inputValues, setInputValues] = useState(
    Array(allFields.length).fill("")
  ); // 初始值为空
  const clickEditCell = (docIndex, field) => {
    // const newIndex = {};
    // newIndex.docIndex = docIndex;
    // newIndex.field = field;
    // console.log(newIndex);
    // setEditIndex(newIndex);
    // setShowEdit(false);
  };
  //输入值改变时，InputValues更新，同时更新sendInput
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };
  const [showInput, setShowInput] = useState(false);
  async function handleEditCell(docIndex, field) {
    // const newDoc = docs[docIndex];
    // newDoc[field] = newEditValue;
    // console.log(newDoc);
    // await updateDoc({
    //   collection: name,
    //   doc: newDoc,
    // });
    // fetchDocs();
    // //关闭编辑输入框
    // setEditIndex({ field: "", docIndex: "" });
    // setNewEditValue("");
  }
  const handleAddRow = () => {
    setShowInput(!showInput);
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
  //数据库的collection名
  const name = "code";

  //向后端新增一行数据
  const handleSubmitRow = async () => {
    //根据inputValues生成sendInput
    const sendValues = {};
    for (let i = 0; i < allFields.length; i++) {
      sendValues[allFields[i]] = inputValues[i];
    }
    try {
      const response = await addDoc({
        collection: name,
        doc: sendValues,
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
    fetchDocs();
  }, []);
  return (
    <div className="min-h-screen min-w-screen  bg-gradient-to-r from-green-100 to-white flex  justify-center  border-4 flex-col">
      {/* 主表格 */}
      <div className="table w-full max-w-full max-h-[500px] overflow-auto shadow-lg  bg-white">
        {/* 表格头 */}
        <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="table-row">
            {allFields.map((item, index) => (
              <div
                key={index}
                className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap"
              >
                <h2 className=" font-semibold">{item}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* //docs是数组，doc是对象 */}
        {/* 表格行 */}
        <div className="table-row-group overflow-x-auto">
          {docs.length > 0 &&
            docs.map((doc, docIndex) => (
              <div key={docIndex} className="table-row">
                {allFields.map((field, index) => (
                  <div
                    key={index}
                    className="table-cell p-3 border-gray-300 text-center border-y-2 whitespace-nowrap overflow-hidden "
                  >
                    {!(
                      editIndex.field === field &&
                      editIndex.docIndex === docIndex
                    ) ? (
                      <h2 className="">
                        {doc[field]}{" "}
                        {showEdit && (
                          <EditTwoTone
                            twoToneColor="#a6a6a6"
                            onClick={() => {
                              clickEditCell(docIndex, field);
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
                            onClick={() => handleEditCell(docIndex, field)}
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
                    {item.toLowerCase().includes("date") ? (
                      <input
                        type="date"
                        className="  w-full max-w-fit p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={inputValues[index]}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <textarea
                        className=" w-full max-w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none whitespace-nowrap"
                        placeholder="Please input"
                        rows="1"
                        style={{
                          overflow: "hidden", // 隐藏滚动条
                        }}
                        value={inputValues[index]} // 绑定输入框的值
                        onChange={(e) => {
                          e.target.style.height = "auto"; // 重置高度
                          e.target.style.height = `${e.target.scrollHeight}px`; // 设置为内容高度
                          handleInputChange(index, e.target.value);
                          e.target.value = e.target.value.replace(/\n/g, "");
                          console.log(e.target.value);
                        }} // 更新状态
                      ></textarea>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>{" "}
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
    </div>
  );
}
