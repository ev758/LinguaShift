import api from '../api.js';
import { useNavigate, useParams } from "react-router";

const PasswordReset = () => {
    //declarations
    const { passwordResetToken } = useParams();
    const navigate = useNavigate();

    const resetPassword = async (event) => {
        event.preventDefault();
        const password = document.getElementById("password").value;

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

  return (
    <>
      <div>
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