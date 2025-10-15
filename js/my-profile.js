let emailDelLogin = localStorage.getItem('email');

// Siempre cargar el perfil del email actual
let userProfile = JSON.parse(localStorage.getItem('userProfile_' + emailDelLogin));
if (!userProfile) {
  // Si no existe, crea uno nuevo
  userProfile = {
    name: "",
    email: emailDelLogin || "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    postalCode: "",
    photo: ""
  };
  localStorage.setItem('userProfile_' + emailDelLogin, JSON.stringify(userProfile));
}

// Inputs y displays
let nameInput = document.getElementById('username');
let emailInput = document.getElementById('email');
let phoneInput = document.getElementById('phone');
let ageInput = document.getElementById('age');
let genderInput = document.getElementById('gender');
let addressInput = document.getElementById('address');
let postalCodeInput = document.getElementById('postalCode');
let profilePicInput = document.getElementById('profile-pic-input');
let saveBtn = document.getElementById('saveBtn');
let editBtn = document.getElementById('editBtn');
let displayName = document.getElementById('display-username');
let displayEmail = document.getElementById('display-email');
let displayPhone = document.getElementById('display-phone');
let displayAge = document.getElementById('display-age');
let displayGender = document.getElementById('display-gender');
let displayAddress = document.getElementById('display-address');
let displayPostalCode = document.getElementById('display-postalCode');
let profilePic = document.getElementById('profile-pic');
let profileMessage = document.getElementById('profile-message');

let profileView = document.getElementById('profile-view');
let profileEditForm = document.getElementById('profile-edit-form');

// Navbar email
let usuarioEmailBtn = document.getElementById('usuario-email');

function loadProfile() {
  displayName.textContent = userProfile.name || "Sin nombre";
  displayEmail.textContent = userProfile.email || "Sin correo";
  displayPhone.innerHTML = `<strong>Teléfono:</strong> ${userProfile.phone || "-"}`;
  displayAge.innerHTML = `<strong>Edad:</strong> ${userProfile.age || "-"}`;
  displayGender.innerHTML = `<strong>Sexo:</strong> ${userProfile.gender || "-"}`;
  displayAddress.innerHTML = `<strong>Dirección:</strong> ${userProfile.address || "-"}`;
  displayPostalCode.innerHTML = `<strong>Código Postal:</strong> ${userProfile.postalCode || "-"}`;
  if(userProfile.photo) profilePic.src = userProfile.photo;
  // Actualizar email en navbar
  if (usuarioEmailBtn) usuarioEmailBtn.textContent = userProfile.email || "";
}

function fillInputs() {
  nameInput.value = userProfile.name || "";
  emailInput.value = userProfile.email || "";
  phoneInput.value = userProfile.phone || "";
  ageInput.value = userProfile.age || "";
  genderInput.value = userProfile.gender || "Masculino";
  addressInput.value = userProfile.address || "";
  postalCodeInput.value = userProfile.postalCode || "";
}

function saveProfile() {
  // Si el usuario cambia el correo, actualiza el perfil y la clave en localStorage
  let oldEmail = userProfile.email;
  userProfile.name = nameInput.value.trim();
  userProfile.email = emailInput.value.trim();
  userProfile.phone = phoneInput.value.trim();
  userProfile.age = ageInput.value.trim();
  userProfile.gender = genderInput.value;
  userProfile.address = addressInput.value.trim();
  userProfile.postalCode = postalCodeInput.value.trim();

  // Si cambió el correo, elimina el perfil anterior y guarda el nuevo
  if (userProfile.email !== oldEmail) {
    localStorage.removeItem('userProfile_' + oldEmail);
    localStorage.setItem('email', userProfile.email); // Actualiza el email de sesión
  }

  function guardarYMostrar() {
    localStorage.setItem('userProfile_' + userProfile.email, JSON.stringify(userProfile));
    localStorage.setItem('email', userProfile.email);
    showMessage("¡Perfil actualizado!");
    loadProfile();
    switchToView();
  }

  if(profilePicInput.files && profilePicInput.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      userProfile.photo = e.target.result;
      guardarYMostrar();
    }
    reader.readAsDataURL(profilePicInput.files[0]);
  } else {
    guardarYMostrar();
  }
}

function showMessage(msg){
  profileMessage.textContent = msg;
  profileMessage.className = "text-success mt-3";
  setTimeout(()=>{ profileMessage.textContent=""; }, 3000);
}

function switchToView() {
  profileEditForm.style.display = "none";
  profileView.style.display = "block";
}

function switchToEdit() {
  profileView.style.display = "none";
  profileEditForm.style.display = "block";
  fillInputs();
}

saveBtn.addEventListener('click', saveProfile);
editBtn.addEventListener('click', switchToEdit);

loadProfile();
switchToView();