import React, { useState, useEffect } from "react";
import styled from "styled-components"; //它允许你使用 JavaScript 来编写css
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../api/user";

function Login() {
  const navigate = useNavigate(); //hook函数，用于导航
  //登录处理逻辑
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      console.log("ok")
      const { password, username } = values;
      const user = { password: password, username: username };

      //只有登录认证成功是200，其他都是4xx
      try {
        const response = await login(user);
        console.log(response.status);
        if (response.status === 200) {
          //登录成功把用户信息放在localStorage
          localStorage.setItem("money-book-token", response.data.token);
          navigate("/");
        }
      } catch (error) {
       
        toast.error(error.response.data.message, toastOptions);
      }
    }
  };

  //{...values}: 这是对象展开运算符（spread operator）。它会将 values 对象中的所有键值对复制到一个新的对象中。这样做的目的是保留现有的状态值，同时只更新特定的键。
  //event.target.name 通常是你在 <input> 或其他表单元素上设置的 name 属性
  //event.target.value: 这是用户输入或选择的当前值

  //用于双向绑定的useState hook函数
  //表单数据
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  //实现双向绑定
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

  function handleValidation() {
    //解构赋值
    const { password, username } = values;
    if (username.length <= 3) {
      toast.error("Username should be longer than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password should be  6 characters at least. ", toastOptions);
      return false;
    }
    return true;
  }

  return (
    <>
      <FormContainer className="bg-gradient-to-r from-green-100 to-white">
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="bg-green-100"
        >
          <div className="brand">
            <img src="logo.svg" alt="Logo"></img>
            <h1>money book</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          ></input>

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          ></input>

          <button type="submit">Login</button>
          <span>
            still have no account? <Link to="/register">register</Link>
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

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #2f855a; /* 深绿色 */
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #f0fff4; /* 浅绿色背景 */
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    background-color: #38a169; /* 绿色按钮背景 */
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #2f855a; /* 深绿色背景 */
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
        text-decoration: underline;
      }
    }
  }
`;

export default Login;
