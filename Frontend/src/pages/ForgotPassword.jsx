import api from '../api.js';
import '../styles/forgot-password.css';

const ForgotPassword = () => {

  const passwordResetRequest = async (event) => {
    event.preventDefault();
    //declarations
    const email = document.getElementById("email").value;
    const notification = document.getElementById("notification");

    try {
      //HTTP POST request
      const response = await api.post("forgot-password/", {email: email});

      if (response.status !== 200) {
        throw new Error("Could not send password reset email");
      }

      notification.textContent = "An email with a password reset url has been sent to your inbox."
    }
    catch (error) {
      notification.textContent = "Invalid email address, please enter your email.";
      notification.style.color = "red";
      
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
                passwordResetRequest(event);
              }
            }
          }>
            <h2 className="forgot-password-title">Forgot Password</h2>

            <label htmlFor="email">Enter your email</label>
            <br/>
            <input type="email" id="email" name="email"/>
        </form>

        <br/>
        <span id="notification"></span>
      </div>
    </>
  )
}

export default ForgotPassword;