const validation = () => {
    const patterns = {
        firstName: /^[A-Z][a-z]{1,29}$/,
        lastName: /^[A-Z][a-z]{1,29}([-\s][A-Z][a-z]{1,29})?$/,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
        username: /^[a-z\d]{3,20}$/i,
        password: /^[a-z\d!@#$%^&*]{20,30}$/i
    }
    const inputs = document.querySelectorAll("input");
    let output = true;

    inputs.forEach((input) => {
        if (input.name !== "" && patterns[input.name].test(input.value)) {
            return;
        }
        else if (input.name === "") {
            return;
        }
        else {
            output = false;
            input.style.border = "2px solid red";
        }
    });

    return output;
}

export default validation;