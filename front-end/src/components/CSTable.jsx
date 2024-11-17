import React from "react";
import { useEffect, useState } from "react";
export default function CSTable({ docs }) {
  const [data, setData] = useState([]);
  const [totalPL, setTotalPL] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  //之后优化应该会用到useMemo
  const updateData = () => {
    const newData = [];
    let newTotalPL = 0;
    let newTotalInvestment = 0;
    docs.map((doc) => {
      //新的每一行
      const newRow = {};
      //保持同一id
      newRow.id = doc._id;

      //price和amount是必存在的
      const amount = Number(doc["Amount"]) || 0;

      const price = Number(doc["Unit Price"]) || 0;

      //后面两个值可能为0或null
      const rentalIncome = Number(doc["Rental Income"]) || 0;

      const totalSellPrice = Number(doc["Total Sell Price"]) || 0;

      //专门装数据的数组
      const array = [];

      if (totalSellPrice !== 0) {
        const profitAndLoss = totalSellPrice + rentalIncome - amount * price;
        //说明已经卖出去了
        array.push({
          field: "Profit and Loss",
          value: totalSellPrice + rentalIncome - amount * price,
        });
        array.push({
          field: "Present Investment",
          //便于计算，写number
          value: 0,
        });
        newTotalPL += profitAndLoss;
      } else {
        //说明没有卖出去
        array.push({
          field: "Profit and Loss",
          value: 0,
        });
        const presentInvestment = amount * price - rentalIncome;
        array.push({
          field: "Present Investment",
          value: amount * price - rentalIncome,
        });
        newTotalInvestment += presentInvestment;
      }
      newRow.data = array;
      newData.push(newRow);
    });
    setData(newData);
    setTotalPL(newTotalPL);
    setTotalInvestment(newTotalInvestment);
  };
  useEffect(() => {
    if (docs.length > 0) {
      updateData();
    }
  }, [docs]);

  return (
    <div className="flex flex-row gap-4">
      <div className="table w-full shadow-lg overflow-hidden bg-white">
        {/* 表格头 */}
        <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="table-row">
            <div className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap">
              <h2 className=" font-semibold">Profit and Loss</h2>
            </div>
            <div className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap">
              <h2 className=" font-semibold">Present Investment</h2>
            </div>
          </div>
        </div>

        <div className="table-row-group">
          {" "}
          {data.map((item, index) => {
            return (
              <div key={index} className="table-row ">
                {item.data.map((cell, index2) => (
                  <div
                    key={index2}
                    className="table-cell p-3 border-gray-300 text-center border-y-2  max-w-lg break-words"
                  >
                    <h2 className="  max-w-lg break-words">{cell.value}</h2>
                  </div>
                ))}

                {/* 渲染Total P&L和 Total Investment*/}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div>
        <div>
          Profit and Loss
          {data.map((item, index) => {
            return <div key={index}>{item.data[0].value}</div>;
          })}
        </div>
        <div>
          Present Investment{" "}
          {data.map((item, index) => {
            return <div key={index}>{item.data[1].value}</div>;
          })}
        </div>
      </div>
      <div>Total P&L:{totalPL}</div>
      <div>Total Investment:{totalInvestment}</div> */}

      {/* 第二张表 */}
      <div className="table w-full shadow-lg  overflow-hidden bg-white ">
        {/* 表格头 */}
        <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="table-row">
            <div className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap">
              <h2 className=" font-semibold">Total P&L</h2>
            </div>
            <div className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap">
              <h2 className=" font-semibold">Current Investment</h2>
            </div>
          </div>
        </div>

        <div className="table-row-group">
          {" "}
          <div className="table-row ">
            <div className="table-cell p-3 border-gray-300 text-center border-y-2  max-w-lg break-words">
              <h2 className=" max-w-lg break-words">{totalPL}</h2>
            </div>
            <div className="table-cell p-3 border-gray-300 text-center border-y-2  max-w-lg break-words">
              <h2 className=" max-w-lg break-words">{totalInvestment}</h2>
            </div>

            {/* 渲染Total P&L和 Total Investment*/}
          </div>
        </div>
      </div>
    </div>
  );
}
