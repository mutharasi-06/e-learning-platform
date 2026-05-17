// Backend URL
const API_URL = "http://localhost:5000";

// Get form and inputs
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Login submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page refresh

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Success
    alert("Login successful");

    // Save token
    localStorage.setItem("token", data.token);

    console.log("TOKEN:", data.token);

  } catch (error) {
    console.error(error);
    alert("Backend not running");
  }
});
