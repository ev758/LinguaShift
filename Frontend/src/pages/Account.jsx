import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import getUser from "../utils/get_user.js";
import validation from "../utils/validation.js";
import AccountImage from "../assets/account.jpg";
import "../styles/account.css";

const Account = () => {
  //declarations
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUser(setUser);
  }, []);

  const updateAccount = async (event) => {
    event.preventDefault();
    //declarations
    const accountData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      password: ""
    };
    let count = 0;

    for (const field in accountData) {
      //If a user did not entered an empty string and the data is new, increment count
      if (event.target[count].value !== "" && event.target[count].value !== accountData[field]) {
        count++;
      }
    }

    if (validation()) {
      try {
        //If count is equal to five, the user entered new data to each field to update their account
        if (count === 5) {
          //HTTP PUT request
          const response = await api.put(`account/update/${user.id}/`, {
            first_name: event.target.firstName.value,
            last_name: event.target.lastName.value,
            email: event.target.email.value,
            username: event.target.username.value,
            password: event.target.password.value
          });

          if (response.status !== 200) {
            throw new Error("Could not update account");
          }

          window.location.reload();
        }
        //If count is less than five, the user entered new data to specific fields to update their account
        else {
          count = 0;

          for (const field in accountData) {
            //If a user did not entered an empty string and the data is new, replace current user data with the new data and increment count
            if (event.target[count].value !== "" && event.target[count].value !== accountData[field]) {
              accountData[field] = event.target[count].value;
              count++;
            }
            else {
              //If a user entered an empty string or the data is not new, delete current data in the object and increment count
              delete accountData[field];
              count++;
            }
          }

          //HTTP PATCH request
          const response = await api.patch(`account/${user.id}/update/`, accountData);

          if (response.status !== 200) {
            throw new Error("Could not update account");
          }

          window.location.reload();
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      setShowAlert(true);
    }
  }

  const deleteAccount = async () => {
    try {
      //HTTP DELETE request
      const response = await api.delete(`account/${user.id}/delete/`);

      if (response.status !== 204) {
        throw new Error("Could not delete account");
      }

      localStorage.clear();
      navigate("/")
    }
    catch (error) {
      console.error(error);
    }
  }

  const close = () => setShow(false);

  return (
    <>
      <div>
        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Invalid Inputs</Alert.Heading>
          <ul>
            <li>First name must be capitalized, have letters only, and a length between 2-30.</li>
            <li>Last name is optional. If it is only one last name, it needs to be capitalized, 
            have letters, and a length between 2-30. A last name with two names needs to be 
            capitalized, have letters and can include a hyphen or space between the two last names, 
            and a length between 2-30 for each one.</li>
            <li>Email must be a valid email address.</li>
            <li>Username must only have letters, numbers, and a length between 3-20.</li>
            <li>Password must only have letters, numbers, or special characters (!@#$%^&*), and a length between 20-30.</li>
          </ul>
        </Alert>

        <h1 className="account-title">LinguaShift</h1>

        <img className="account-image" src={AccountImage} alt="Account image"/>
        <h3>{user.first_name} {user.last_name}</h3>
        <h3>{user.email}</h3>

        <form className="forms user-account" id="account" onSubmit={updateAccount}>
            <br/>

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

        {/* Update Account and Translation History Buttons */}
        <div className="user-account-buttons">
          <Button
            className="account-update-button"
            as="input"
            type="submit"
            form="account"
            value="Update Account"
            variant="dark"
          />
          <Button
            className="translation-history-button"
            href="/account/translation-history"
            variant="dark"
          >View Translation History</Button>
        </div>

        {/* Delete Account Button */}
        <Button variant="danger" onClick={() => {setShow(true)}}>Delete Account</Button>

        {/* Account Deletion Modal */}
        <Modal show={show} onHide={close}>
          <Modal.Header>
            <Modal.Title>Account Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your account? All data will be deleted.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={deleteAccount}>
              Yes
            </Button>
            <Button variant="danger" onClick={close}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default Account;