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
    console.log('ok')

    if (handleValidation()) {
      console.log("ok");
      const { password, username } = values;
      const user = { password: password, email: username };
      //只有登录认证成功是200，其他都是4xx
      try {
        const response = await login(user);
        console.log(response);
        if (response.status === 200) {
          //登录成功把用户信息放在localStorage
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("user", response.data.user);
          localStorage.setItem("userId", response.data.user._id);


          console.log(navigator); // 显示浏览器的 User-Agent 字符串


          navigate("/");

        }
      } catch (error) {
        toast.error(error.response.data.message, toastOptions);
      }
    }
  };

  //用于双向绑定的useState hook函数
  //表单数据
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  //实现双向绑定
  function handleChange(event) {
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
      toast.error("Email should be longer than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password should be 6 characters at least.", toastOptions);
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
          autoComplete="on"
          id="login-form"
          name="login-form"
        >
          <div className="brand">
            <img src="logo.svg" alt="Logo"></img>
            <h1>money book</h1>
          </div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Email"
            autoComplete="username"
            onChange={(e) => handleChange({ ...e, target: { ...e.target, name: "username" } })}
            value={values.username}
            required
          ></input>

          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={values.password}
            required
          ></input>

          <button type="submit">Login</button>
          <span>
            Still have no account? <Link to="/register">Register</Link>
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

    &:hover {
      background-color: #2f855a; /* 深绿色背景 */
    }
  }
  span {
    color: #2f855a; /* 深绿色文字 */

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
