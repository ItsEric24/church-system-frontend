const registerBtn = document.getElementById("register-btn");
const registerForm = document.getElementById("register-form");

function generateUniqueCardNumber() {
  const prefix = "PCEA-";
  const generatedNumbers = new Set(); // To store unique numbers

  // Function to generate a random 4-digit number
  function generateRandomDigits() {
    return Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit number
  }

  // Generate unique card number
  let randomDigits;
  do {
    randomDigits = generateRandomDigits();
  } while (generatedNumbers.has(randomDigits)); // Retry if the number exists

  generatedNumbers.add(randomDigits); // Store the new number
  return `${prefix}${randomDigits}`; // Combine prefix and digits as a string
}

async function registerUser(userData) {
  const response = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (response.status === 200) {
    window.location.href = "./login.html";
  }
}

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from submitting immediately

  const cardNumber = generateUniqueCardNumber()
  const formData = {cardNumber};

  // Select all input fields in the form
  const inputs = document.querySelectorAll("#register-form input");

  // Loop through each input field and capture its value
  inputs.forEach((input) => {
    formData[input.name] = input.value; // Use input name as the key and value as the value
  });

  // Output the captured form data
  await registerUser(formData);
});
