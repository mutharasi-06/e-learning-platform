const API = "http://localhost:5000/api";

// SIGNUP
async function signup() {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  });
  const data = await res.json();
  alert(data.message);
  if (res.ok) window.location.href = "login.html";
}

// LOGIN
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
}

// LOAD COURSES
async function loadCourses() {
  const res = await fetch(`${API}/courses`);
  const courses = await res.json();
  const div = document.getElementById("courses");
  div.innerHTML = "";
  courses.forEach(c => {
    div.innerHTML += `
      <div class="course">
        <b>${c.title}</b><br>
        ${c.description}<br>
        ₹${c.price}<br>
        <button onclick="enroll('${c._id}')">Enroll</button>
      </div>
    `;
  });
}

// ENROLL
async function enroll(courseId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ courseId })
  });
  const data = await res.json();
  alert(data.message);
  loadMyCourses();
}

// LOAD MY COURSES
async function loadMyCourses() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/enrollments/my`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const enrollments = await res.json();
  const div = document.getElementById("myCourses");
  div.innerHTML = "";
  enrollments.forEach(e => {
    div.innerHTML += `
      <div class="course">
        <b>${e.courseId.title}</b><br>
        Progress: ${e.progress}%<br>
        <button onclick="updateProgress('${e._id}')">Complete</button>
        <button onclick="certificate('${e.courseId._id}')">Certificate</button>
      </div>
    `;
  });
}

// UPDATE PROGRESS
async function updateProgress(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API}/enrollments/progress/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ progress: 100 })
  });
  alert("Course completed");
  loadMyCourses();
}

// CERTIFICATE
async function certificate(courseId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/certificates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ courseId })
  });
  const data = await res.json();
  alert(data.message);
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
