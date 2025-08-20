import React from "react";
import { useNavigate } from "react-router-dom";
import { HistoryOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
// 把转换按钮二合一了
export default function SwitchToFinished({ onClick, active }) {
    // JSX 里不允许直接用 { ... } 包裹多个顶层元素,但在最外层加<></>即可
    const tooltipTitle = active ? "优先查看完结项目" : "优先查看活跃项目";
    const IconComponent = active ? HistoryOutlined : ClockCircleOutlined;
    return (
        <>
            <Tooltip title={tooltipTitle}>
                <button
                    onClick={onClick}
                    className="px-4 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 ml-4"
                >
                    <IconComponent style={{ fontSize: "24px" }} />
                </button>
            </Tooltip>
        </>
    );
}