const clockHours = document.getElementById('h-hours');
const clockMinutes = document.getElementById('h-minutes');
const clockSeconds = document.getElementById('h-seconds');
const txtData = document.getElementById('txt-data');
const txtSaudacao = document.getElementById('txt-saudacao');
const btnToggleFormat = document.getElementById('btn-toggle-format');

let is24hMode = true;

// Gerenciador de Abas Único
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-content'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-content');
    event.currentTarget.classList.add('active');
}

function toggleFormat() {
    is24hMode = !is24hMode;
    btnToggleFormat.textContent = is24hMode ? "FORMATO 12H" : "FORMATO 24H";
    renderClock();
}

// 1. ENGINE DO RELÓGIO & SAUDAÇÃO
function renderClock() {
    const now = new Date();
    
    // Processamento de Data Estilizada
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    txtData.textContent = now.toLocaleDateString('pt-BR', options).toUpperCase().replace('.', '');

    // Motor de Saudação Baseado no Horário
    const currentHour = now.getHours();
    if (currentHour >= 5 && currentHour < 12) {
        txtSaudacao.textContent = "SISTEMA ONLINE // BOM DIA";
    } else if (currentHour >= 12 && currentHour < 18) {
        txtSaudacao.textContent = "SISTEMA ONLINE // BOA TARDE";
    } else {
        txtSaudacao.textContent = "SISTEMA ONLINE // BOA NOITE";
    }

    // Cálculo do Formato de Exibição
    let displayHour = currentHour;
    if (!is24hMode) {
        const marker = displayHour >= 12 ? " PM" : " AM";
        displayHour = displayHour % 12 || 12;
        clockSeconds.nextElementSibling.textContent = "SEG" + marker;
    } else {
        clockSeconds.nextElementSibling.textContent = "SEGUNDOS";
    }

    clockHours.textContent = String(displayHour).padStart(2, '0');
    clockMinutes.textContent = String(now.getMinutes()).padStart(2, '0');
    clockSeconds.textContent = String(now.getSeconds()).padStart(2, '0');
}
setInterval(renderClock, 1000);
renderClock();

// 2. ENGINE DO CRONÔMETRO DE ALTA PRECISÃO
let chronoInterval = null;
let chronoTime = 0; // em milissegundos

function startChrono() {
    if (chronoInterval) return;
    const startTimestamp = Date.now() - chronoTime;
    
    chronoInterval = setInterval(() => {
        chronoTime = Date.now() - startTimestamp;
        
        const ms = Math.floor((chronoTime % 1000) / 10);
        const sec = Math.floor((chronoTime / 1000) % 60);
        const min = Math.floor((chronoTime / 60000) % 60);

        document.getElementById('c-ms').textContent = String(ms).padStart(2, '0');
        document.getElementById('c-sec').textContent = String(sec).padStart(2, '0');
        document.getElementById('c-min').textContent = String(min).padStart(2, '0');
    }, 10);
}

function pauseChrono() {
    clearInterval(chronoInterval);
    chronoInterval = null;
}

function resetChrono() {
    pauseChrono();
    chronoTime = 0;
    document.getElementById('c-ms').textContent = "00";
    document.getElementById('c-sec').textContent = "00";
    document.getElementById('c-min').textContent = "00";
}

// 3. ENGINE DO TIMER POMODORO
let pomodoroInterval = null;
let pomodoroTimeLeft = 1500; // 25 minutos em segundos
let isFocusMode = true;

function updatePomodoroDisplay() {
    const min = Math.floor(pomodoroTimeLeft / 60);
    const sec = pomodoroTimeLeft % 60;
    document.getElementById('p-display').textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startPomodoro() {
    if (pomodoroInterval) return;
    
    pomodoroInterval = setInterval(() => {
        if (pomodoroTimeLeft > 0) {
            pomodoroTimeLeft--;
            updatePomodoroDisplay();
        } else {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            // Alternância Automática Foco/Descanso
            isFocusMode = !isFocusMode;
            pomodoroTimeLeft = isFocusMode ? 1500 : 300; 
            document.getElementById('p-status').textContent = isFocusMode ? "MODO FOCO" : "PAUSA CURTA";
            alert(isFocusMode ? "Hora de focar!" : "Hora de descansar um pouco!");
            startPomodoro();
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
}

function resetPomodoro() {
    pausePomodoro();
    isFocusMode = true;
    pomodoroTimeLeft = 1500;
    document.getElementById('p-status').textContent = "MODO FOCO";
    updatePomodoroDisplay();
}