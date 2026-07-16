import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import getUser from "../utils/get_user.js";
import "../styles/translation-history.css";

const TranslationHistory = () => {
  //declarations
  const [translationHistory, setTranslationHistory] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getTranslations = async () => {
        try {
            //HTTP GET request
            const response = await api.get("account/translation-history/");

            if (response.status != 200) {
                throw new Error("Could not get translation history");
            }

            //reformats each object's date
            for (let i = 0; i < response.data.length; i++) {
                const date = response.data[i].date;
                const array = date.split("-");
                const format = `${array[1]}/${array[2]}/${array[0]}`;

                response.data[i].date = format;
            }

            setTranslationHistory(response.data)
        }
        catch (error) {
            console.error(error);
        }
    }

    getTranslations();
    getUser(setUser);
  }, []);

  const deleteTranslationHistory = async () => {
    try {
        //HTTP DELETE request
        const response = await api.delete(`account/${user.id}/translation-history/delete/`)

        if (response.status !== 204) {
            throw new Error("Could not delete translation history");
        }

        window.location.reload();
    }
    catch (error) {
        console.error(error);
    }
  }

  return (
    <>
      <div>
        <h1 className="translation-title">LinguaShift</h1>

        <Table className="table-translations" bordered>
            <caption className="table-title">Translation History</caption>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Language</th>
                    <th>Text</th>
                    <th>Translated Language</th>
                    <th>Translated Text</th>
                </tr>
            </thead>
            <tbody>
                {
                    translationHistory.map(translations => 
                        <tr key={translations.translation_id}>
                            <td>{translations.date}</td>
                            <td>{translations.language}</td>
                            <td>{translations.text}</td>
                            <td>{translations.translated_language}</td>
                            <td>{translations.translated_text}</td>
                        </tr>
                    )
                }
            </tbody>
        </Table>

        <br/>
        <Button variant="danger" onClick={deleteTranslationHistory}>Delete Translation History</Button>
      </div>
    </>
  )
}

export default TranslationHistory;