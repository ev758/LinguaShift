import api from "../api.js";

const getUser = async (setUser) => {
    try {
        //HTTP GET request
        const response = await api.get("account/");

        if (response.status !== 200) {
            throw new Error("Could not get user");
        }

        setUser(response.data);
    }
    catch (error) {
        console.log(error);
    }
}

export default getUser;