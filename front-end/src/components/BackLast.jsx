import React from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, RollbackOutlined, HomeOutlined } from "@ant-design/icons";
export default function BackLast({ path }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(path)}>
            {" "}
            < button className="px-4 py-3  bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 ml-4" >
                {" "}
                < RollbackOutlined style={{ fontSize: "24px" }
                } />
            </button >
        </div >

    );
}