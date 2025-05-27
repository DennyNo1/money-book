import React, { useState, useMemo } from "react";
import styled from "styled-components"; //它允许你使用 JavaScript 来编写css
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { register, checkUsername } from "../api/user";
import FormInput from "../components/FormInput";


function Register() {
  const navigate = useNavigate(); //hook函数，用于导航

  const [validatePass, setValidatePass] = useState(true);
  //强制用邮箱登录
  const formFields = [
    { name: "email", type: "text", placeholder: "Email" },
    { name: "nickname", type: "text", placeholder: "Nickname" },
    { name: "password", type: "password", placeholder: "Password" },
    { name: "confirmPassword", type: "password", placeholder: "Confirm password" }
  ];
  //表单数据
  const [values, setValues] = useState({
    // username: "",
    //由email替代username
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  // 验证状态
  const [validationState, setValidationState] = useState({
    email: { isValid: false, error: "Email cannot be empty" },
    nickname: { isValid: false, error: "Nickname cannot be empty" },
    password: { isValid: false, error: "Password required" },
    confirmPassword: { isValid: false, error: "Confirm password required" }
  });

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }
  // 如果没有values.password，放在组件外部更好，不会跟着组件渲染时，重新渲染。
  // 现在由于需要依赖values.password进行验证，使用useMemo，只在values.password变化时，重新渲染。

  const validators = useMemo(() => (
    {
      email: [
        //还有一种写法是：isValid: (val) => val.trim() !== "",两者等价，即省略了return，但我非常不推荐这个省略写法
        {
          isValid: (val) => {
            return val.trim() !== "";
          },
          errorMsg: "Email cannot be empty"
        },
        {
          isValid: (val) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          },
          errorMsg: "Invalid email format"
        },
        {
          isValid: async (val) => {
            const { data } = await checkUsername(val);
            return data.status !== false;
          },
          errorMsg: "Email already taken"
        }
      ],
      // 可以添加其他字段的验证
      password: [
        {
          isValid: (val) => {
            return val.trim() !== "";
          },
          errorMsg: "Password cannot be empty"
        },
        {
          isValid: (val) => {
            return val.length >= 6;
          },
          errorMsg: "Password must be at least 6 characters long"
        }
      ],
      nickname: [
        {
          isValid: (val) => {
            return val.trim() !== "";
          },
          errorMsg: "Nickname cannot be empty"
        },
        {
          isValid: (val) => {
            return val.length <= 20;
          },
          errorMsg: "Nickname must be at most 20 characters long"
        }
      ],
      confirmPassword: [
        {
          isValid: (val) => {
            return val.trim() !== "";
          },
          errorMsg: "Confirm password cannot be empty"
        },
        {
          isValid: (val) => {
            return val === values.password;
          },
          errorMsg: "Passwords do not match"
        }
      ]
    }), [values.password]);




  //对某个输入框失去焦点的单独处理
  async function handleBlur(event) {
    const { name, value } = event.target;

    // 获取当前字段的验证规则
    const fieldValidators = validators[name] || [];

    // 执行验证链
    for (const validator of fieldValidators) {
      //这里使用promise.resolve，是因为validator.isValid是一个异步和同步混合的函数，需要使用await来等待结果。
      const result = await Promise.resolve(validator.isValid(value));
      if (!result) {
        setValidationState({
          ...validationState,
          [name]: { isValid: false, error: validator.errorMsg }
        });
        return;
      }
    }
    // 对单个输入框的验证通过
    setValidationState({
      ...validationState,
      [name]: { isValid: true, error: "" }
    });

  }



  //处理提交
  const handleSubmit = async (event) => {
    event.preventDefault();
    //提交前，对所有输入框进行验证


    for (const field of formFields) {
      //对每个输入框逐个进行验证
      const name = field.name;
      const fieldValidators = validators[name] || [];

      for (const validator of fieldValidators) {
        const result = await Promise.resolve(validator.isValid(values[name]));

        if (!result) {
          setValidationState({
            ...validationState,
            [name]: { isValid: false, error: validator.errorMsg }
          });
          // 添加抖动类
          // 找到对应的错误消息元素并添加抖动类
          // 在表单验证失败时
          setTimeout(() => {
            document.querySelectorAll('.error-message').forEach(el => {
              if (el.textContent) {
                el.classList.add('error-scale');

                // 动画结束后移除类，以便下次可以再次触发
                setTimeout(() => {
                  el.classList.remove('error-scale');
                }, 500);
              }
            });
          }, 10);
          setValidatePass(false);
          //一旦验证失败，就停止对这个输入框后续的验证
          break;
        }
      }
    }
    if (!validatePass) {
      return;
    }
    console.log("ok");
    //不允许连续提交
    const { password, nickname, email } = values;
    const user = {
      password: password,
      nickname: nickname,
      email: email,
    };

    //它这里并没有为前端发送请求独立出一个方法，我觉得不好。
    const { data } = await register(user);

    if (data.status === false) {
      toast.error(data.msg, toastOptions);
    } else {
      navigate("/");
    }

  };



  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };




  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src="/logo.svg" alt="Logo"></img>
            <h1>money book</h1>
          </div>
          {formFields.map(field => (
            <FormInput
              key={field.name}
              {...field}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationState[field.name].error}
            />
          ))}
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
  span 
  {
    color: #2f855a; /* 深绿色文字 */
    // text-transform: uppercase;
    a {
      color: #38a169; /* 绿色链接 */
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline; /* 鼠标悬停下划线 */
      }
    }
  }
@keyframes scale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.error-message {
  color: red;
  display: inline-block; /* 确保变换效果正确应用 */
  transition: all 0.3s ease;
}

.error-scale {
  animation: scale 0.5s ease;
}
`;

export default Register;
