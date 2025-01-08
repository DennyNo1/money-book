import React, { useState, useEffect } from "react";
import styled from "styled-components"; //它允许你使用 JavaScript 来编写css
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { register, checkUsername } from "../api/user";

function Register() {
  const navigate = useNavigate(); //hook函数，用于导航

  //用于双向绑定的useState hook函数
  //表单数据
  const [values, setValues] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  //判断用户名是否重复
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  //处理提交
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      const { password, username, nickname } = values;
      const user = {
        password: password,
        nickname: nickname,
        username: username,
      };
      //console.log("ok");
      //它这里并没有为前端发送请求独立出一个方法，我觉得不好。
      const { data } = await register(user);

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else {
        navigate("/");
      }
    }
  };

  //{...values}: 这是对象展开运算符（spread operator）。它会将 values 对象中的所有键值对复制到一个新的对象中。这样做的目的是保留现有的状态值，同时只更新特定的键。
  //event.target.name 通常是你在 <input> 或其他表单元素上设置的 name 属性
  //event.target.value: 这是用户输入或选择的当前值

  function handleChange(event) {
    console.log(event);
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //处理用户名输入的额外函数
  function handleUsernameChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    const newUsername = event.target.value;

    if (newUsername.length === 0) {
      setIsUsernameAvailable(null);
      return;
    }

    // 防抖处理，确保在用户停止输入后再发送请求
    clearTimeout(window.debounceTimer);
    window.debounceTimer = setTimeout(async () => {
      try {
        await checkUsername(newUsername);
        setIsUsernameAvailable(true);
      } catch (error) {
        setIsUsernameAvailable(false);
        toast.error("The username already be used", toastOptions);
      }
    }, 500); // 500 毫秒防抖
  }

  function handleValidation() {
    //解构赋值
    const { password, confirmPassword, username, nickname } = values;
    if (password !== confirmPassword) {
      //我们一般用组件库了
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 6) {
      toast.error("Username should be longer than 6 characters.", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error(
        "Password should be longer than 6 characters .",
        toastOptions
      );
      return false;
    } else if (nickname === "") {
      toast.error("Please input nickname ", toastOptions);
      return false;
    }
    return true;
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src="/logo.svg" alt="Logo"></img>
            <h1>money-book</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleUsernameChange}
            ></input>
            {/* {isUsernameAvailable === null ? null : isUsernameAvailable ? (
              <span style={{ color: "green" }}>Username available</span>
            ) : (
              <span style={{ color: "red" }}>Username already taken</span>
            )} */}
          </div>
          <input
            type="text"
            placeholder="Nickname"
            name="nickname"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
          ></input>
          <button type="submit">Create User</button>
          <span>
            already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f0fff4; /* 浅绿色背景 */
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #2f855a; /* 深绿色文字 */
      text-transform: uppercase;
    }
  }

  form {
    background-color: #f0fff4; /* 浅绿色背景 */
    display: flex;
    flex-direction: column;
    gap: 2rem;

    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
  }
  input {
    background-color: #ffffff; /* 白色背景 */
    padding: 1rem;
    border: 0.1rem solid #38a169; /* 绿色边框 */
    border-radius: 0.4rem;
    color: #2f855a; /* 深绿色文字 */
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #48bb78; /* 浅绿色边框 */
      outline: none;
    }
  }
  button {
    background-color: #38a169; /* 按钮绿色背景 */
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #2f855a; /* 按钮深绿色背景 */
    }
  }
  span {
    color: #2f855a; /* 深绿色文字 */
    text-transform: uppercase;
    a {
      color: #38a169; /* 绿色链接 */
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline; /* 鼠标悬停下划线 */
      }
    }
  }
`;

export default Register;
