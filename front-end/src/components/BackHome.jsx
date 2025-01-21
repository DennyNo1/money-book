import React from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EditTwoTone, HomeOutlined } from "@ant-design/icons";
export default function BackHome() {
  const navigate = useNavigate();
  return (
    <div className="absolute top-10 left-10" onClick={() => navigate("/")}>
      {" "}
      <button className="px-4 py-3  bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300">
        {" "}
        <HomeOutlined style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
}
