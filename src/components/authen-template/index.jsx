import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";

function AuthenTemplate({ isLogin }) {
  return (
    <div className="authen-template">
      <div className="authen-template_form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
      <div className="authen-template_image"></div>
    </div>
  );
}

export default AuthenTemplate;
