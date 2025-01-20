import React from "react";
import { Drawer, Divider, Checkbox } from "antd";
import { useState, useEffect } from "react";
import { addCalculateTable, getCalculateTable } from "../api/calculate";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";

//drawer
function CalculateDrawer({ allFields = [], showDrawer, closeDrawer, docs }) {
  //新field名
  const [newFieldName, setNewFieldName] = useState([]);
  const [fields, setFields] = useState(allFields); // 本地的所有field
  const [localDocs, setLocalDocs] = useState(docs);
  const [formula, setFormula] = useState(""); // 用户输入的公式
  const { name } = useParams();
  // 创建状态存储选中的字段
  const [selectedFields, setSelectedFields] = useState([]);
  const [calculateTable, setCalculateTable] = useState([]);

  // 监听 allFields 的变化，并同步到本地状态
  useEffect(() => {
    setFields(allFields);
    // console.log(allFields);
  }, [allFields]);

  useEffect(() => {
    setLocalDocs(docs);
  }, [docs]);

  //仅在渲染后 执行一次
  useEffect(() => {
    fetchCalculateTable();
  }, []);

  // 处理 Checkbox 的选中状态变化
  const onChange = (checked, field) => {
    if (checked) {
      // 添加选中的字段
      setSelectedFields((prev) => [...prev, field]);
    } else {
      // 移除未选中的字段
      setSelectedFields((prev) => prev.filter((item) => item !== field));
    }
  };

  const handleCalculate = async () => {
    if (!formula || !formula.trim()) {
      alert("Please enter a formula!");
      return;
    }

    try {
      //localDocs：
      // [
      //   {
      //     "12": "5",
      //     "11111": "2",
      //     "_id": "678096e9804f840812f1bdf3",
      //     "名字": "1",
      //     "1111111111111111111111111111111111111111111": "3",
      //     "number": "55",
      //     "shuzi": "66",
      //     "s": "77"
      //   },
      //   {
      //     "12": "33",
      //     "11111": "333",
      //     "_id": "67809907804f840812f1be08",
      //     "名字": "2",
      //     "1111111111111111111111111111111111111111111": "3",
      //     "number": "333",
      //     "shuzi": "333",
      //     "s": "88"
      //   }
      // ]
      //这里的row就是上方的一个对象
      const result = localDocs.map((row) => {
        // selectedFields:
        //         [
        //   "shuzi",
        //   "s",
        //   "444",
        //   "1"
        // ]
        const context = selectedFields.reduce((acc, col) => {
          // 返回一个acc对象。每个属性，即被被选中的field，后面的值即原本的值。本质上就是筛选docs，返回被选择的kv，k=被选中的field。
          acc[col] = parseFloat(row[col]) || 0; // 将值转换为数字类型，默认值为 0
          //
          return acc;
        }, {});

        // 使用动态函数计算公式
        return new Function(...Object.keys(context), `return ${formula}`)(
          ...Object.values(context)
        );
      });

      console.log(result);

      await addCalculateTable(name, formula, result, newFieldName);
      //清空表格
      closeDrawer();
      setNewFieldName("");
      setFormula("");
      setSelectedFields([]);
      fetchCalculateTable();
    } catch (error) {
      console.log(error);
      alert("Error,please check your formula");
    }
  };
  //从数据库获取计算表的数据
  const fetchCalculateTable = async () => {
    try {
      const { data } = await getCalculateTable(name);
      setCalculateTable(data.data);
    } catch (error) {
      console.error("Error fetching table:", error);
    }
  };

  return (
    <div>
      <DisplayTable data={calculateTable}></DisplayTable>
      {/* drawer，用于产生新的列，并进行加减乘除的运算 */}
      <Drawer onClose={closeDrawer} open={showDrawer}>
        <div className="text-lg ">
          {" "}
          <label className="block text-gray-700 mt-4">
            New Calculate Field
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 mb-10"
            required
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
          <label className="block text-gray-700 mb-4">
            Select Field To Calculate
          </label>
          {fields.length > 1 &&
            fields.map(
              (item, index) =>
                item.type === "number" && (
                  <Checkbox
                    className="p-2"
                    onChange={(e) => onChange(e.target.checked, item.field)}
                    checked={selectedFields.includes(item.field)} // 根据选中状态动态设置
                    key={index}
                  >
                    {item.field}
                  </Checkbox>
                )
            )}
          {/* <Divider /> */}
          <div style={{ marginTop: "16px" }}>
            <label className="block text-gray-700 mb-4 mt-10">
              Input Your Formula
            </label>
            <textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Example: A + B * C"
              className="h-40 w-full p-2"
            />
          </div>
          <button
            onClick={handleCalculate}
            type="submit"
            className="w-full py-2 my-10 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
          >
            Calculate
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default CalculateDrawer;
