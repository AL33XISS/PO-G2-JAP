if (localStorage.getItem("email")) {
  location.replace("index.html");
}

function myFunctionIngresar(event) {
  event.preventDefault();

  let email = document.querySelector('input[type="email"]').value;
  let password = document.querySelector('input[type="password"]').value;

  if (email !== "" && password !== "") {
    localStorage.setItem("email", email);

    // Si no existe perfil para este email, crea uno nuevo
    if (!localStorage.getItem("userProfile_" + email)) {
      localStorage.setItem("userProfile_" + email, JSON.stringify({
        name: "",
        email: email,
        phone: "",
        age: "",
        gender: "Masculino",
        address: "",
        postalCode: "",
        photo: ""
      }));
    }

    location.replace("index.html");
  } else {
    alert("Por favor completa email y contraseña");
  }
}

