const loginBtn = document.getElementById("login-btn");
const loginForm = document.getElementById("loginForm");

async function loginUser(userData) {
  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  const status = response.status;
  return { data, status };
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {};
  const inputs = document.querySelectorAll("#loginForm input");

  inputs.forEach((input) => {
    formData[input.name] = input.value;
  });

  const { data, status } = await loginUser(formData);

  if (status === 200) {
    localStorage.setItem("authToken", JSON.stringify(data));

    if (data && !data.isAdmin) {
      window.location.href = "./users/dashboard-user.html";
    }

    if (data && data.isAdmin) {
      window.location.href = "./admin/dashboard-admin.html";
    }
  } else {
    const errorMessage = document.createElement("p");
    errorMessage.innerText = data.message + " try again please. Check credentials";
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center"
    errorMessage.style.fontSize = "20px"
    document.body.appendChild(errorMessage);
  }
});
