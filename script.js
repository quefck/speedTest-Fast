// --- 1. CONFIG ---
const CANVA_API_KEY = "-";
const GPT_API_KEY = "AIzaSyBx56EpSHcwNvGb01b5CwZ4szazNNB6dMU";

// --- 2. MATRIX EFFECT ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const drops = Array(Math.floor(canvas.width / 16)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "16px monospace";
    drops.forEach((y, i) => {
        const text = Math.floor(Math.random() * 2);
        ctx.fillText(text, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 50);

// --- 3. UI LOGIC ---
const startBtn = document.getElementById('startBtn');
const dashboard = document.getElementById('dashboard');
const resultArea = document.getElementById('resultArea');
const procBtn = document.getElementById('proc');
const fileInput = document.getElementById('f');
const preview = document.getElementById('preview');

// Tombol Start Klik
startBtn.addEventListener('click', () => {
    dashboard.classList.add('active');
    startBtn.style.display = 'none';
    
    // Auto Fill Waktu
    const n = new Date();
    document.getElementById('tgl').value = `${n.getDate()}/${n.getMonth()+1}/${n.getFullYear()}`;
    document.getElementById('wkt').value = `${n.getHours()}:${n.getMinutes()}`;
});

// Preview Foto
fileInput.addEventListener('change', function() {
    preview.innerHTML = "";
    if (this.files.length > 8) {
        alert("Maksimal 8 foto!");
        this.value = "";
        return;
    }
    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('placeholder').style.display = "none";
});

// TOMBOL PROCESSED (INTI LOGIKA)
procBtn.addEventListener('click', () => {
    if(fileInput.files.length === 0) return alert("Pilih foto dulu!");

    procBtn.innerText = "PROCESSING...";
    procBtn.style.background = "#ffa500";

    // Simulasi Delay API
    setTimeout(() => {
        dashboard.classList.remove('active');
        resultArea.classList.add('active');

        document.getElementById('resultTable').innerHTML = `
            <tr><td><b>Status</b></td><td style="color:#0f0">CONNECTED</td></tr>
            <tr><td><b>Tanggal</b></td><td>${document.getElementById('tgl').value}</td></tr>
            <tr><td><b>Waktu</b></td><td>${document.getElementById('wkt').value}</td></tr>
            <tr><td><b>Files</b></td><td>${fileInput.files.length} Item</td></tr>
            <tr><td><b>API AI</b></td><td>AUTH_SUCCESS</td></tr>
        `;
        procBtn.innerText = "Processed";
        procBtn.style.background = "#fff";
    }, 1500);
});

// Tombol Back
document.getElementById('backBtn').addEventListener('click', () => {
    resultArea.classList.remove('active');
    dashboard.classList.add('active');
});
