import api from "../api.js";
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import '../styles/signup.css';

const SignUp = () => {
  const navigate = useNavigate();

  const createAccount = async (event) => {
    event.preventDefault();
    //declarations
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      //HTTP POST request
      const response = await api.post("signup/", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        password: password,
      });

      if (response.status !== 201) {
        throw new Error("Could not create account");
      }

      navigate("/login");
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <form className="forms signup" id="signup" method="post" onSubmit={createAccount}>
            <h2 className="signup-title">Sign Up</h2>

            {/* First Name Input */}
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName"/>
            <br/>
            <br/>
            <br/>

            {/* Last Name Input */}
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName"/>
            <br/>
            <br/>
            <br/>

            {/* Email Input */}
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email"/>
            <br/>
            <br/>
            <br/>

            {/* Username Input */}
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username"/>
            <br/>
            <br/>
            <br/>

            {/* Password Input */}
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password"/>
        </form>

        <Button className="signup-button" as="input" type="submit" form="signup" value="Sign Up" variant="dark"/>
      </div>
    </>
  )
}

export default SignUp;