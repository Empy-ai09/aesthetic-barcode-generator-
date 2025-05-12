const tabs      = document.querySelectorAll("nav button");
const tabContents = document.querySelectorAll(".tab-content");
const form      = document.getElementById("generator-form");
const result    = document.getElementById("result");
const cardTitle = document.getElementById("card-title");
const canvas    = document.getElementById("qrcode");

// Switch tab
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach(tc => tc.classList.add("hidden"));
    document.getElementById(`${tab.dataset.tab}-tab`).classList.remove("hidden");
  });
});

// Generate QR
form.addEventListener("submit", e => {
  e.preventDefault();
  const type  = document.querySelector("nav button.active").dataset.tab;
  const title = document.getElementById("title").value;
  let content = "";

  if (type === "wifi") {
    const ssid = document.getElementById("ssid").value;
    const pwd  = document.getElementById("password").value;
    content = `WIFI:T:WPA;S:${ssid};P:${pwd};;`;
  } else if (type === "text") {
    content = document.getElementById("text").value;
  } else {
    content = document.getElementById("url").value;
  }

  // Set judul dan tampilkan card
  cardTitle.textContent = title;
  result.classList.remove("hidden");

  // Clear & regen QR dengan size 200
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  new QRious({
    element: canvas,
    value: content,
    size: 200,         // pastikan besar QR
    background: 'white',
    foreground: '#000'
  });
});