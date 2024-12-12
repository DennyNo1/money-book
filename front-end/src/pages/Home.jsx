import React from "react";
import "../input.css"; // 确保引入了 Tailwind CSS
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { getCSMarketIndex, getStockIndex } from "../api";
import { Spin } from "antd";

function Home() {
  const navigate = useNavigate();
  const [CSIndex, setCSIndex] = useState([]);
  const [StockIndex, setStockIndex] = useState({});

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
  const fetchStockIndex = async () => {
    const response = await getStockIndex();
    // console.log(response.data);
    setStockIndex(response.data);
  };

  useEffect(() => {
    fetchCSIndex();
    fetchStockIndex();
  }, []);
  const handleClick = (destination) => {
    navigate(destination);
    // 在这里添加点击事件的处理逻辑
  };
  return (
    <div>
      <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-green-100 to-white">
        <div className="w-auto h-auto grid grid-cols-3 gap-4  justify-center items-center">
          <div
            onClick={() => handleClick("/moneybook")}
            className="border-2 w-48 h-48  flex justify-center items-center rounded-lg border-green-500 transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src="/money.jfif"
              className="w-full h-full rounded-lg transition-opacity duration-500 opacity-0"
              onLoad={(e) => (e.target.style.opacity = 1)}
            />
          </div>
          <div
            onClick={() => handleClick("/code")}
            className="border-2 w-48 h-48 flex justify-center items-center rounded-lg border-green-500 transition-transform duration-300 transform hover:scale-105 bg-white"
          >
            <img
              src="/code.svg"
              className="w-full h-full rounded-lg transition-opacity duration-500 opacity-0"
              onLoad={(e) => (e.target.style.opacity = 1)}
            />
          </div>
          <div className="border-2 w-48 h-48 flex justify-center items-center rounded-lg border-green-500 text-xl font-semibold transition-transform duration-300 transform hover:scale-105 bg-white">
            Coming Soon!
          </div>
        </div>
        <div className="absolute top-6 left-0 right-0 w-1/3">
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                {CSIndex.length > 0 ? (
                  <Statistic
                    title="饰品指数"
                    value={CSIndex[0]}
                    precision={2}
                  />
                ) : (
                  <Spin></Spin>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                {CSIndex.length > 0 ? (
                  <Statistic
                    title="市场热度"
                    value={CSIndex[1]}
                    precision={2}
                  />
                ) : (
                  <Spin></Spin>
                )}
              </Card>
            </Col>
          </Row>
          {/* 有了微软财经，就不需要了 */}
          {/* <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Card bordered={false}>
                {CSIndex.length > 0 ? (
                  <Statistic
                    title="纳斯达克100"
                    value={StockIndex.nasdaq100Index}
                    precision={2}
                  />
                ) : (
                  <Spin></Spin>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                {CSIndex.length > 0 ? (
                  <Statistic title="标普500" value={StockIndex.sp500Index} precision={2} />
                ) : (
                  <Spin></Spin>
                )}
              </Card>
            </Col>
          </Row> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
