// Function to check form validation and send registration request to backend
function check() {
  // Get values from the form
  const name = document.getElementById('usernamein').value;
  const email = document.getElementById('emailin').value;
  const newpassword = document.getElementById('newpass').value;
  const confirmpassword = document.getElementById('conpass').value;
  const year = document.getElementById('year').value;

  // Simple form validation
  if (!name || !email || !newpassword || !confirmpassword || !year) {
      alert('Please fill in all the fields');
      return;
  }

  // Check if passwords match
  if (newpassword !== confirmpassword) {
      alert('Passwords do not match');
      return;
  }

  // Check password strength
  const passwordStrength = passvali(newpassword);
  if (!passwordStrength) {
      alert('Password is too weak');
      return;
  }

  // Create data object to send to the backend
  const data = {
      name: name,
      email: email,
      newpassword: newpassword,
      confirmpassword: confirmpassword,
      year: year
  };

  // Send POST request to the backend API
  fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // Convert JavaScript object to JSON
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse response as JSON
  })
  .then(data => {
      if (data.success) {
          alert('Registration successful');
          // You can redirect the user to the login page or reset the form
          window.location.href = 'login.html';
      } else {
          alert(data.message); // Display error message from backend
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('There was an error with the registration. Please try again.');
  });
}

// Function to validate password strength
function passvali(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  const strengthDiv = document.getElementById('str');

  if (password.match(regex)) {
      strengthDiv.innerHTML = "<p style='color:green;'>Password strength: Strong</p>";
      return true;
  } else {
      strengthDiv.innerHTML = "<p style='color:red;'>Password must contain at least 6 characters, one uppercase, one lowercase, and one number</p>";
      return false;
  }
}
