document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("usernamein").value;
  const password = document.getElementById("passwordin").value;

  // Send data to backend for login verification
  fetch('login.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert("Login successful!");
          window.location.href = "dashboard.html"; // Redirect to a dashboard or home page
      } else {
          alert("Login failed. " + data.message);
      }
  })
  .catch(error => console.error('Error:', error));
});
