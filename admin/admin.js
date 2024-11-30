document.addEventListener("DOMContentLoaded", async () => {
  
  //GET events  
  async function getEvents() {
    const response = await fetch("http://localhost:3000/events");

    const data = await response.json();

    if (response.status === 200) {
      const tableBody = document.querySelector("#events-table tbody");

      data.events.forEach((event) => {
        const row = document.createElement("tr");
        let new_time = "";

        // Split the time string (e.g., "14:30" -> ["14", "30"])
        const [hour, minute] = event.event_time.split(":").map(Number);

        // Determine AM/PM and adjust the hour for 12-hour format
        if (hour >= 12) {
          const adjustedHour = hour === 12 ? hour : hour - 12;
          new_time = `${adjustedHour}:${
            minute < 10 ? "0" + minute : minute
          } PM`;
        } else {
          const adjustedHour = hour === 0 ? 12 : hour;
          new_time = `${adjustedHour}:${
            minute < 10 ? "0" + minute : minute
          } AM`;
        }

        row.innerHTML = `
            <td>${event.event_name}</td>
            <td>${event.event_date}</td>
            <td>${new_time}</td>
          `;

        tableBody.appendChild(row);
      });
    } else {
      alert(data.message);
    }
  }
   //GET request to fetch users
  async function getUsers(adminEmail) {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        Authorization: adminEmail,
      },
    });

    const data = await response.json();
    const status = response.status;

    if (status === 200) {
      const tbody = document.querySelector("#users-table tbody");

      data.users.forEach((user) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.districtNumber}</td>
          <td>${user.cardNumber}</td>
        `;

        tbody.appendChild(row);
      });
    } else {
      console.log(data);
    }
  }

  // Function to check if the user is authenticated (token exists)
  function checkAuthentication() {
    // Try to retrieve the token from local storage
    const dataInfo = JSON.parse(localStorage.getItem("authToken"));

    // If no token exists or it's invalid, redirect to login
    if (!dataInfo || dataInfo === "undefined" || dataInfo === null) {
      window.location.href = "../login/login.html"; // Redirect to login page
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

  await getEvents()

  const adminInfo = JSON.parse(localStorage.getItem("authToken"));

  if (adminInfo) {
    const adminEmail = adminInfo.email;
    await getUsers(adminEmail);
  }

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

  //POST resquest to add events into the system database
  async function addEvent(eventData) {
    const response = await fetch("http://localhost:3000/events/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const status = response.status;
    const data = await response.json();

    if (status === 201) {
      alert(data.message);
    }
  }

  const eventAddForm = document.getElementById("event-form");

  eventAddForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    eventFormData = {};
    const inputs = document.querySelectorAll("#event-form input");

    inputs.forEach((input) => {
      eventFormData[input.name] = input.value;
    });

    const userEmail = JSON.parse(localStorage.getItem("authToken"));

    if (userEmail.email) {
      const email = userEmail.email;
      console.log(userEmail);
      await addEvent({ email, ...eventFormData });
      eventAddForm.reset()
    }
  });
});
