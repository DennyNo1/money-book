import React, { useState } from "react";
import { useEffect } from "react";

function DisplayTable({ data }) {
  const [localData, setLocalData] = useState([]);
  useEffect(() => {
    setLocalData(data);
  }, [data]);
  return (
    <div>
      {localData.map((item, index) => (
        <div key={index}>
          {" "}
          {/* 表头 */}
          <div className="table w-auto max-h-[500px] overflow-auto shadow-lg  bg-white ml-20">
            <div className="table-header-group bg-gradient-to-r from-green-400 to-green-600 text-white ">
              <div className="table-row">
                <div className="table-cell p-3 border-r border-gray-300 last:border-none text-center whitespace-nowrap ">
                  <h2 className=" font-semibold">{item.field}</h2>
                </div>
              </div>
            </div>
            {/* 数据列表 */}
            {item.data.map((row, index) => (
              <div key={index}>
                {" "}
                <div className="table-row-group overflow-x-auto">
                  <div className="table-row">
                    <div className="table-cell p-3 border-gray-300 text-center border-y-2 whitespace-nowrap overflow-hidden ">
                      <h2>{row}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayTable;
