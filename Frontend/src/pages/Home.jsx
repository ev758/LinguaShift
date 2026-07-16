import api from "../api.js";
import { ACCESS_TOKEN } from "../constants.js";
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { Link } from "react-router";
import getUser from "../utils/get_user.js";
import '../styles/home.css';

const Home = () => {
  //declarations
  const [languages, setLanguages] = useState({});
  const [languageText, setLanguageText] = useState("");
  const [user, setUser] = useState({});
  const token = localStorage.getItem(ACCESS_TOKEN)

  useEffect(() => {
    //gets languages
    const getLanguages = async () => {
      try {
        //HTTP GET request
        const response = await api.get("languages/");

        if (response.status !== 200) {
          throw new Error("Could not get languages");
        }

        setLanguages(response.data);
      }
      catch (error) {
        console.error(error);
      }
    }

    getUser(setUser);
    getLanguages();
  }, []);

  useEffect(() => {
    //translates language
    const languageTranslation = async () => {
      //declarations
      const inputLanguageCode = document.getElementById("inputLanguageOptions").value;
      const outputLanguageCode = (document.getElementById("outputLanguageOptions").value === "EN") ? "EN-US" : document.getElementById("outputLanguageOptions").value;
      const translatedLanguage = document.getElementById("translatedLanguageText");

      try {
        //HTTP POST request
        const response = await api.post("translation/", {
          inputLanguageCode: inputLanguageCode,
          outputLanguageCode: outputLanguageCode,
          languageText: languageText,
        });

        if (response.status !== 200) {
          throw new Error("Could not translate language");
        }

        const translatedText = response.data.translatedText;
        translatedLanguage.textContent = translatedText;

        if (!token) {
          return;
        }
        else {
          saveTranslation(translatedText)
        }
      }
      catch (error) {
        console.error(error);
      }
    }

    //When a user has stopped typing, sets timeout for 1 second to perform language translation
    const delayDebounceTranslation = setTimeout(() => {
      const inputLanguageText = document.getElementById("inputLanguageText").value;
      
      if (inputLanguageText.trim() === "") {
        return;
      }

      console.log("User stopped typing. Performing language Translation.");
      languageTranslation();
    }, 1000);

    //clear timeout if user is still typing
    return () => clearTimeout(delayDebounceTranslation)
  }, [languageText]);

  const saveTranslation = async (translatedText) => {
    //declarations
    const inputLanguageSelect = document.getElementById("inputLanguageOptions");
    const outputLanguageSelect = document.getElementById("outputLanguageOptions");
    const inputLanguage = inputLanguageSelect.options[inputLanguageSelect.selectedIndex].text;
    const outputLanguage = outputLanguageSelect.options[outputLanguageSelect.selectedIndex].text;

    try {
      //HTTP POST request
      const response = await api.post(`account/${user.id}/translation-history/save/`, {
        language: inputLanguage,
        text: languageText,
        translated_language: outputLanguage,
        translated_text: translatedText
      });

      if (response.status !== 201) {
        throw new Error("Could not save translation");
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        {
          //If a user is not logged in, display login and sign up buttons.
          (!token) ?
          //Login and Sign Up Buttons
          <div className="account-buttons">
            <Button href="/login" variant="dark">Log in</Button>
            <Button href="/sign-up" variant="dark">Sign up</Button>
          </div>
          :
          //Account Button
          <div>
            <DropdownButton className="account" title={<span className="material-icons">person</span>} variant="light">
              <Dropdown.Item href="/account">View Account</Dropdown.Item>
              <Dropdown.Item onClick={
                () => {
                  localStorage.clear();
                  window.location.reload();
                }
              }>Logout</Dropdown.Item>
            </DropdownButton>
          </div>
        }
        <h1 className="title">LinguaShift</h1>

        <div className="language-container">
          {/* Left Side - Input Language */}
          <div>
            {
              (Object.keys(languages).length === 0) ?
              <Form.Select className="language-options" disabled>
                <option>Loading options...</option>
              </Form.Select>
              :
              <Form.Select className="language-options" id="inputLanguageOptions">
                <option>Select a language</option>
                {
                  //converts object keys to an array, and loops through each language to create a selection of language options
                  Object.keys(languages).map(key => 
                    <option key={key} value={languages[key]}>{key}</option>
                  )
                }
              </Form.Select>
            }

            <Form.Group className="mb-3 language-textbox">
              <Form.Control
                as="textarea"
                className="textbox"
                id="inputLanguageText"
                onChange={(event) => setLanguageText(event.target.value)}
              />
            </Form.Group>
          </div>

          {/* Right Side - Translated Language */}
          <div>
            {
              (Object.keys(languages).length === 0) ?
              <Form.Select className="language-options" disabled>
                <option>Loading options...</option>
              </Form.Select>
              :
              <Form.Select className="language-options" id="outputLanguageOptions">
                <option>Select a language</option>
                {
                  //converts object keys to an array, and loops through each language to create a selection of language options
                  Object.keys(languages).map(key => 
                    <option key={key} value={languages[key]}>{key}</option>
                  )
                }
              </Form.Select>
            }

            <Form.Group className="mb-3 language-textbox">
              <Form.Control as="textarea" className="textbox" id="translatedLanguageText"/>
            </Form.Group>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;
