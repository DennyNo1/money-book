import React from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EditTwoTone, HomeOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
export default function BackHome() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/")}>
      <Tooltip title="返回首页">
        <button className="px-4 py-3  bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300">

          <HomeOutlined style={{ fontSize: "24px" }} />
        </button>
      </Tooltip>
    </div>
  );
}
