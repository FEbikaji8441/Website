document.addEventListener('DOMContentLoaded', () => {
    // Event listener for login form submission
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("usernamein").value;
        const password = document.getElementById("passwordin").value;

        // Send data to backend for login verification
        login(username, password);
    });

    // Event listener for registration form submission
    document.getElementById('registrationForm').addEventListener('submit', function (event) {
        event.preventDefault();
        check(); // Call the check function to validate and send registration request
    });
});

// Function to handle login
function login(username, password) {
    console.log("Username:", username, "Password:", password);  // Log to check if values are correct
    fetch('bzhvpolpef4qbb5gvv76-mysql.services.clever-cloud.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        // Check if the response is OK (2xx), or handle other statuses
        return response.json().then(data => {
            if (response.ok) {
                // Success case (e.g., status 200)
                alert("Login successful!");
                window.location.href = "dashboard.html";  // Redirect on success
            } else {
                // Failure case (e.g., status 400)
                alert("Login failed: " + data.message);
            }
        });
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('There was an error with the login process. Please try again.');
    });
}

// Function to check form validation and send registration request to backend
function check() {
    const name = document.getElementById('usernamein').value;
    const email = document.getElementById('emailin').value;
    const newpassword = document.getElementById('newpass').value;
    const confirmpassword = document.getElementById('conpass').value;
    const year = document.getElementById('year').value;

    if (!name || !email || !newpassword || !confirmpassword || !year) {
        alert('Please fill in all the fields');
        return;
    }

    if (newpassword !== confirmpassword) {
        alert('Passwords do not match');
        return;
    }

    if (!passvali(newpassword)) {
        return; // Already alerts inside passvali
    }

    // Include confirmpassword in the data object
    const data = {
        name,
        email,
        newpassword,
        confirmpassword, // Add this line
        year
    };

    registerUser(data);
}
// Function to send registration data to the server
function registerUser(data) {
    fetch('bzhvpolpef4qbb5gvv76-mysql.services.clever-cloud.com', { // Use HTTP for local development
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert JavaScript object to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed'); // Handle non-200 responses
        }
        return response.json(); // Parse response as JSON
    })
    .then(data => {
        if (data.success) {
            alert('Registration successful');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(data.message); // Display error message from backend
        }
    })
    .catch(error => {
        console.error('Error during registration:', error);
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
