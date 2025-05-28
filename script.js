const tabs      = document.querySelectorAll("nav button");
const tabContents = document.querySelectorAll(".tab-content");
const form      = document.getElementById("generator-form");
const result    = document.getElementById("result");
const cardTitle = document.getElementById("card-title");
const cardType  = document.getElementById("card-type");
const canvas    = document.getElementById("qrcode");
const generatedTime = document.getElementById("generated-time");
const downloadBtn = document.getElementById("download-btn");

// Switch tab
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach(tc => tc.classList.add("hidden"));
    document.getElementById(`${tab.dataset.tab}-tab`).classList.remove("hidden");
  });
});

// Function to create downloadable card image
function createCardImage() {
  const cardElement = document.querySelector('.card');
  const cardRect = cardElement.getBoundingClientRect();
  
  // Create canvas for the card
  const cardCanvas = document.createElement('canvas');
  const ctx = cardCanvas.getContext('2d');
  
  // Set canvas size (fixed size for consistent output)
  const cardWidth = 400;
  const cardHeight = 500;
  cardCanvas.width = cardWidth;
  cardCanvas.height = cardHeight;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cardWidth, cardHeight);
  
  // Create frosted glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(30, 30, cardWidth - 60, cardHeight - 60);
  
  // Add border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, cardWidth - 60, cardHeight - 60);
  
  // Add title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  const title = cardTitle.textContent;
  ctx.fillText(title, cardWidth / 2, 100);
  
  // Add type badge
  const type = cardType.textContent;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  const badgeWidth = 80;
  const badgeHeight = 25;
  const badgeX = (cardWidth - badgeWidth) / 2;
  const badgeY = 115;
  
  // Rounded rectangle for badge
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
  ctx.fill();
  
  // Badge text
  ctx.fillStyle = 'white';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(type.toUpperCase(), cardWidth / 2, badgeY + 17);
  
  // Add QR code
  const qrSize = 160;
  const qrX = (cardWidth - qrSize) / 2;
  const qrY = 170;
  
  // White background for QR
  ctx.fillStyle = 'white';
  ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30);
  
  // Add shadow for QR container
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30);
  ctx.shadowColor = 'transparent';
  
  // Draw QR code
  ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);
  
  // Add "Scan QR Code" text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('Scan QR Code', cardWidth / 2, qrY + qrSize + 40);
  
  // Add generated time
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '12px Inter, sans-serif';
  const timeText = generatedTime.textContent;
  ctx.fillText(timeText, cardWidth / 2, qrY + qrSize + 65);
  
  return cardCanvas;
}

// Download function
function downloadCard() {
  const cardCanvas = createCardImage();
  
  // Create download link
  const link = document.createElement('a');
  link.download = `qr-card-${cardTitle.textContent.replace(/\s+/g, '-').toLowerCase()}.png`;
  link.href = cardCanvas.toDataURL('image/png');
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate QR
form.addEventListener("submit", e => {
  e.preventDefault();
  const type  = document.querySelector("nav button.active").dataset.tab;
  const title = document.getElementById("title").value;
  let content = "";
  let typeLabel = "";

  if (type === "wifi") {
    const ssid = document.getElementById("ssid").value;
    const pwd  = document.getElementById("password").value;
    content = `WIFI:T:WPA;S:${ssid};P:${pwd};;`;
    typeLabel = "Wi-Fi";
  } else if (type === "text") {
    content = document.getElementById("text").value;
    typeLabel = "Text";
  } else {
    content = document.getElementById("url").value;
    typeLabel = "Link";
  }

  // Set judul, tipe, dan waktu
  cardTitle.textContent = title;
  cardType.textContent = typeLabel;
  
  // Set waktu generate
  const now = new Date();
  const timeString = now.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  generatedTime.textContent = `Generated: ${timeString}`;
  
  // Tampilkan card
  result.classList.remove("hidden");

  // Clear & regen QR dengan size 160
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  new QRious({
    element: canvas,
    value: content,
    size: 160,
    background: 'white',
    foreground: '#1a1a1a'
  });

  // Smooth scroll ke hasil
  result.scrollIntoView({ behavior: 'smooth' });
});

// Download button event listener
downloadBtn.addEventListener('click', downloadCard);