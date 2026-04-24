// --- 1. CONFIGURATION (TEMPAT API KEY) ---
const CANVA_API_KEY = "ISI_API_KEY_KAMU_DISINI";
const AI_SECRET = "AIzaSyAwSuq3MVyPNI0SGIeitSHefCTAQKij2RY";

// --- 2. MATRIX BACKGROUND ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// --- 3. UI ELEMENTS ---
const startBtn = document.getElementById('startBtn');
const dashboard = document.getElementById('dashboard');
const resultArea = document.getElementById('resultArea');
const fileInput = document.getElementById('f');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('uploadPlaceholder');
const tglInput = document.getElementById('tgl');
const wktInput = document.getElementById('wkt');
const procBtn = document.getElementById('proc');

// --- 4. LOGIC APP ---

// Tombol Start
startBtn.addEventListener('click', () => {
    dashboard.classList.add('active');
    startBtn.style.display = 'none';
    const n = new Date();
    tglInput.value = `${String(n.getDate()).padStart(2,'0')} / ${String(n.getMonth()+1).padStart(2,'0')} / ${n.getFullYear()}`;
    wktInput.value = `${String(n.getHours()).padStart(2,'0')} : ${String(n.getMinutes()).padStart(2,'0')}`;
});

// Import Foto & Validasi 8
fileInput.addEventListener('change', function() {
    if (this.files.length > 8) {
        alert("⛔ CANCEL! Maksimal 8 foto bos.");
        this.value = ""; preview.innerHTML = ""; placeholder.style.display = "block";
        return;
    }
    preview.innerHTML = "";
    if (this.files.length > 0) {
        placeholder.style.display = "none";
        Array.from(this.files).forEach(file => {
            const r = new FileReader();
            r.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            }
            r.readAsDataURL(file);
        });
    }
});

// Formatter Tanggal (Batas 2030)
tglInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '');
    let out = "";
    if (v.length > 0) {
        let d = parseInt(v.substring(0,2)); if (d > 31) d = 31;
        out += (v.length >= 2) ? String(d).padStart(2,'0') + " / " : v;
    }
    if (v.length > 2) {
        let m = parseInt(v.substring(2,4)); if (m > 12) m = 12;
        out += (v.length >= 4) ? String(m).padStart(2,'0') + " / " : v.substring(2);
    }
    if (v.length > 4) {
        let y = v.substring(4,8); if (parseInt(y) > 2030) y = "2030";
        out += y;
    }
    this.value = out;
});

// Formatter Waktu (Batas 23:59)
wktInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '');
    let out = "";
    if (v.length > 0) {
        let h = v.substring(0,2); if (parseInt(h) > 23) h = "23";
        out += (v.length >= 2) ? h + " : " : v;
    }
    if (v.length > 2) {
        let m = v.substring(2,4); if (parseInt(m) > 59) m = "59";
        out += m;
    }
    this.value = out;
});

// PROSES SIMULASI API KE TABEL
procBtn.addEventListener('click', () => {
    if(fileInput.files.length === 0) return alert("Upload foto dulu!");
    
    procBtn.innerText = "CONNECTING API...";
    
    setTimeout(() => {
        dashboard.classList.remove('active');
        resultArea.classList.add('active');

        document.getElementById('resultTable').innerHTML = `
            <tr><td><b>Parameter</b></td><td><b>Value</b></td></tr>
            <tr><td>Status</td><td style="color:#0f0">CONNECTED</td></tr>
            <tr><td>Tanggal</td><td>${tglInput.value}</td></tr>
            <tr><td>Waktu</td><td>${wktInput.value}</td></tr>
            <tr><td>Files</td><td>${fileInput.files.length} Item</td></tr>
            <tr><td>API KEY</td><td>${CANVA_API_KEY ? 'AUTH_LOADED' : 'MISSING'}</td></tr>
        `;
        procBtn.innerText = "Processed";
    }, 1200);
});

// Tombol Back
document.getElementById('backBtn').addEventListener('click', () => {
    resultArea.classList.remove('active');
    dashboard.classList.add('active');
});
