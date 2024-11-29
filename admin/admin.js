document.addEventListener("DOMContentLoaded", () => {
  // Function to check if the user is authenticated (token exists)
  function checkAuthentication() {
    // Try to retrieve the token from local storage
    const dataInfo = JSON.parse(localStorage.getItem("authToken"));

    // If no token exists or it's invalid, redirect to login
    if (!dataInfo || dataInfo === "undefined" || dataInfo === null) {
      window.location.href = "/login.html"; // Redirect to login page
      return false; // Stop further execution
    }

    // Update the welcome message
    if (dataInfo.username) {
      // User is authenticated
      document.getElementById(
        "welcome-title"
      ).innerText = `Welcome, ${dataInfo.username}`;
      return true;
    }
  }

  // Call authentication check before running any navigation logic
  if (!checkAuthentication()) return;

  // Select all navigation links
  const navLinks = document.querySelectorAll(".sidebar ul li");

  // Select all content sections
  const sections = document.querySelectorAll(".card");

  // Function to show the clicked section
  const showSection = (index) => {
    sections.forEach((section, idx) => {
      // Show the matching section and hide others
      section.classList.toggle("active", idx === index);
    });
  };

  // Attach click event to each navigation link
  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      // Highlight the selected link
      navLinks.forEach((nav) => nav.classList.remove("active"));
      link.classList.add("active");

      // Show corresponding section
      showSection(index);
    });
  });

  // Default to showing the first section
  showSection(0);

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  });

  async function addEvent(eventData) {
    const response = await fetch("http://localhost:3000/events/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const status = response.status
    const data = await response.json()

    if(status === 201){
        alert(data.message)
    }
  }

  const eventAddForm = document.getElementById("event-form")

  eventAddForm.addEventListener("submit", async function(event){
    event.preventDefault()

    eventFormData = {}
    const inputs = document.querySelectorAll("#event-form input")

    inputs.forEach((input) => {
        eventFormData[input.name] = input.value
    })

    const userEmail = JSON.parse(localStorage.getItem("authToken"))

    if(userEmail.email){
        const email = userEmail.email
        console.log(userEmail)
        await addEvent({email, ...eventFormData})
    }
  })
});
