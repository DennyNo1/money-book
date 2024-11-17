import React from "react";
import "../input.css"; // 确保引入了 Tailwind CSS
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { getCSMarketIndex } from "../api";

function Home() {
  const navigate = useNavigate();
  const [CSIndex, setCSIndex] = useState([]);
  const handleClick = () => {
    navigate("/moneybook");
    // 在这里添加点击事件的处理逻辑
  };
  function formatDate(data) {
    console.log(data);
    //提取第一个字符串中的饰品指数数值
    const matchIndex = data[0].match(/饰品指数(\d+\.\d+)/);
    const indexValue = matchIndex ? parseFloat(matchIndex[1]) : null;

    // 提取第二个字符串中的百分比
    const matchPercentage = data[1].match(/(\d+\.\d+%)/);
    const percentageValue = matchPercentage ? matchPercentage[1] : null;

    return [indexValue, percentageValue];
  }
  const fetchCSIndex = async () => {
    const response = await getCSMarketIndex();
    setCSIndex(formatDate(response.data.data));
  };
  useEffect(() => {
    fetchCSIndex();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-green-100 to-white">
        <div className="w-1/4 h-1/4 grid grid-cols-2 gap-4 ">
          <div
            onClick={handleClick}
            className="border-2 w-full h-full flex justify-center items-center rounded-lg border-green-500 transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src="/money.jfif"
              className="w-full h-full rounded-lg transition-opacity duration-500 opacity-0"
              onLoad={(e) => (e.target.style.opacity = 1)}
            />
          </div>
          <div className="border-2 w-full h-full flex justify-center items-center rounded-lg border-green-500 text-xl font-semibold transition-transform duration-300 transform hover:scale-105 bg-white">
            Coming Soon!
          </div>
        </div>
        <div className="absolute top-6 left-0 right-0 w-1/3">
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="饰品指数"
                  value={CSIndex[0]}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="市场热度"
                  value={CSIndex[1]}
                  precision={2}
                  valueStyle={{
                    color: "#cf1322",
                  }}
                  prefix={<ArrowDownOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Home;
