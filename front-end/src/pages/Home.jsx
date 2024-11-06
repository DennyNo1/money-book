import React from "react";
import "../input.css"; // 确保引入了 Tailwind CSS
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/moneybook'); 
    // 在这里添加点击事件的处理逻辑
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-green-100 to-white">
      <div className="w-1/4 h-1/4 grid grid-cols-2 gap-4">
        <div onClick={handleClick} className="border-2 w-full h-full flex justify-center items-center rounded-lg border-green-500 transition-transform duration-300 transform hover:scale-105">
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
    </div>
  );
}

export default Home;
