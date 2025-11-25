if (localStorage.getItem("email")) {
  location.replace("index.html");
}

async function myFunctionIngresar(event) {
  event.preventDefault();

  let email = document.querySelector('input[type="email"]').value;
  let password = document.querySelector('input[type="password"]').value;

  if (email !== "" && password !== "") {
    try {
      // Hacer login en el backend
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Login exitoso
        localStorage.setItem("email", email);
        localStorage.setItem("authToken", data.token);

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
        // Login fallido
        alert("Email o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al hacer login:", error);
      alert("Error al conectar con el servidor");
    }
  } else {
    alert("Por favor completa email y contraseña");
  }
}