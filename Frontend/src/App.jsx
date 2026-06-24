import axios from "axios";
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

function App() {
  //declarations
  const [languages, setLanguages] = useState({});
  const [languageText, setLanguageText] = useState("");

  useEffect(() => {
    //gets languages
    const getLanguages = async () => {
      try {
        //HTTP GET request
        const response = await axios.get(import.meta.env.VITE_DJANGO_SERVER + "languages/");

        if (response.status !== 200) {
          throw new Error("Could not get languages");
        }

        setLanguages(response.data);
      }
      catch (error) {
        console.error(error);
      }
    }

    getLanguages();
  }, []);

  useEffect(() => {
    //translates language
    const languageTranslation = async () => {
      //declarations
      const inputLanguageCode = document.getElementById("inputLanguageOptions").value;
      const outputLanguageCode = document.getElementById("outputLanguageOptions").value;
      const translatedLanguage = document.getElementById("translatedLanguageText");

      try {
        //HTTP POST request
        const response = await axios.post(import.meta.env.VITE_DJANGO_SERVER + "translation/", {
          inputLanguageCode: inputLanguageCode,
          outputLanguageCode: outputLanguageCode,
          languageText: languageText,
        });

        if (response.status !== 200) {
          throw new Error("Could not translate language");
        }

        translatedLanguage.textContent = response.data.translatedText;
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

  return (
    <>
      <div>
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
                id="inputLanguageText"
                rows={10}
                cols={50}
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
              <Form.Control as="textarea" id="translatedLanguageText" rows={10} cols={50}/>
            </Form.Group>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
