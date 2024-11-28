const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const registerForm = document.getElementById("register-form")

async function registerUser(userData) {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData)
  });
  if(response.status === 200){
    window.location.href = "./login.html"
  }
}


registerForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting immediately

    const formData = {};
    
    // Select all input fields in the form
    const inputs = document.querySelectorAll('#register-form input');
    
    // Loop through each input field and capture its value
    inputs.forEach(input => {
      formData[input.name] = input.value;  // Use input name as the key and value as the value
    });

    // Output the captured form data
    await registerUser(formData)
  });
