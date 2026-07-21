import api from '../api.js';
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import validation from '../utils/validation.js';

const PasswordReset = () => {
    //declarations
    const { passwordResetToken } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const resetPassword = async (event) => {
        event.preventDefault();
        const password = document.getElementById("password").value;

        if (validation()) {
          try {
            //HTTP POST request
            const response = await api.post("forgot-password/password-reset/", {
                password: password,
                pw_reset_token: passwordResetToken
            });

            if (response.status !== 200) {
                throw new Error("Could not reset password");
            }

            alert("Password reset, returning to login.");
            navigate("/login");
          }
          catch (error) {
              console.error(error);
          }
        }
        else {
          setShow(true);
        }
    }

  return (
    <>
      <div>
        <Alert variant="danger" show={show} onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Invalid Password</Alert.Heading>
          <p>Password must only have letters, numbers, or special characters (!@#$%^&*), and a length between 20-30.</p>
        </Alert>

        <form
          className="forms forgot-password"
          method="post"
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                resetPassword(event);
              }
            }
          }>
            <h2 className="forgot-password-title">Password Reset</h2>

            <label htmlFor="password">Enter new password</label>
            <br/>
            <input type="password" id="password" name="password"/>
        </form>
      </div>
    </>
  )
}

export default PasswordReset;