import '../styles/forgotpassword.css';

const ForgotPassword = () => {
  return (
    <>
      <div>
        <form className="forms forgot-password">
            <h2 className="forgot-password-title">Forgot Password</h2>

            <label>Enter your email</label>
            <br/>
            <input type="text"/>
        </form>
      </div>
    </>
  )
}

export default ForgotPassword;