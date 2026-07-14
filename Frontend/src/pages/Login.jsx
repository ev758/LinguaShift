import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();

  const authenticate = async (event) => {
    event.preventDefault();
    //declarations
    const emailUsername = document.getElementById("emailUsername").value;
    const password = document.getElementById("password").value;

    try {
      //HTTP POST request
      const response = await api.post("authenticate/", {
        emailUsername: emailUsername,
        password: password,
      });

      if (response.status !== 200) {
        throw new Error("Could not autheticate user");
      }

      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

      navigate("/");
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <form
          className="forms login"
          method="post"
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                authenticate(event);
              }
            }
          }>
            <h2 className="login-title">Login</h2>

            {/* Email/Username Input */}
            <label htmlFor="emailUsername">Email or username</label>
            <br/>
            <input type="text" id="emailUsername" name="emailUsername"/>
            <br/>
            <br/>

            {/* Password Input */}
            <label htmlFor="password">Password</label>
            <br/>
            <input type="password" id="password" name="password"/>
            <br/>
            <br/>
            <br/>

            <div className="form-links">
              <Link to="/sign-up">Create an account</Link> | <Link to="/forgot-password">Forgot password</Link>
            </div>
        </form>
      </div>
    </>
  )
}

export default Login;