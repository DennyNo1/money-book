import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // 导入一个 reducer（详见下一步）

//虽然redux相较于localstorage更加安全，但缺点是刷新页面或关闭浏览器后数据丢失。所以为了用户体验，最基本的信息还是存储在localstorage中。
const store = configureStore({
  reducer: {
    user: userReducer, // 注册你的 slice reducer
  },
});

export default store;
