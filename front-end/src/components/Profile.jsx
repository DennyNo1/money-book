import React, { useState } from "react";
import { Avatar, Button } from "antd";
function Profile() {
  const [user, setUser] = useState(localStorage.getItem("user_nickname"));
  return (
    <div className="absolute right-4 top-4 ">
      {" "}
      <Avatar
        style={{
          backgroundColor: "#87d068",
          verticalAlign: "middle",
          width: 50, // 自定义宽度
          height: 50, // 自定义高度
          fontSize: 30, // 调整字体大小以适应头像
        }}
        size="large"
      >
        {user}
      </Avatar>
    </div>
  );
}

export default Profile;
