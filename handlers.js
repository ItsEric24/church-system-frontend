// Wait until the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
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

  // Function to check if the user is authenticated (token exists)
  function checkAuthentication() {
    // Try to retrieve the token from local storage
    const token = localStorage.getItem("authToken");

    // If no token exists or it's invalid, redirect to login
    if (!token || token === "undefined" || token === null) {
      window.location.href = "/login.html"; // Redirect to login page
    } else {
      // You can also add more logic here to verify the token if necessary
      console.log("Authenticated");
    }
  }

  // Call this function when the page loads
  window.onload = function () {
    checkAuthentication(); // Ensure user is authenticated before allowing access
  };
});
