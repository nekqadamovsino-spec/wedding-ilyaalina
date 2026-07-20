const target = new Date("2026-09-12T15:00:00+03:00");
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjs8Vj2M-5V5Muhz1JyWVHk6U7DlVZIWwFTtQtP213_qM_kDiJuS9_DMJ4W9JctnpP/exec";

function pad(n){ return String(n).padStart(2,"0"); }

function updateCountdown(){
  let diff = target - new Date();
  if(diff < 0) diff = 0;
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  if(!days || !hours || !minutes || !seconds) return;
  days.textContent = Math.floor(diff/(1000*60*60*24));
  hours.textContent = pad(Math.floor((diff/(1000*60*60))%24));
  minutes.textContent = pad(Math.floor((diff/(1000*60))%60));
  seconds.textContent = pad(Math.floor((diff/1000)%60));
}

updateCountdown();
setInterval(updateCountdown, 1000);

function sendRSVP(event){
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const answer = document.getElementById("guestAnswer").value;
  const comment = document.getElementById("guestComment").value.trim();
  const result = document.getElementById("formResult");
  result.textContent = "Отправляем...";
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams({ name, answer, comment })
  });
  result.textContent = name + ", спасибо! Ваш ответ отправлен.";
  event.target.reset();
}

document.querySelectorAll(".gallery img").forEach(img =>
  img.addEventListener("click", () => window.open(img.src, "_blank"))
);

// ===== МУЗЫКА И ОТКРЫТИЕ КОНВЕРТА =====
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
const musicControl = document.querySelector(".music-control");
const envelopeScreen = document.getElementById("envelopeScreen");
const openEnvelope = document.getElementById("openEnvelope");

function setMusicState(isPlaying){
  musicBtn?.classList.toggle("playing", isPlaying);
  musicControl?.classList.toggle("playing", isPlaying);
}

async function playMusic(){
  if(!music) return;
  try{
    music.volume = 0.5;
    await music.play();
    setMusicState(true);
  }catch(error){
    setMusicState(false);
  }
}

if(musicBtn && music){
  musicBtn.addEventListener("click", async event => {
    event.stopPropagation();
    if(music.paused){
      await playMusic();
    }else{
      music.pause();
      setMusicState(false);
    }
  });
}

if(envelopeScreen && openEnvelope){
  document.body.classList.add("envelope-locked");

  openEnvelope.addEventListener("click", async () => {
    if(openEnvelope.classList.contains("opening")) return;
    openEnvelope.classList.add("opening");

    // Нажатие на конверт считается действием пользователя, поэтому музыка запускается надёжнее.
    await playMusic();

    window.setTimeout(() => {
      envelopeScreen.classList.add("opened");
      document.body.classList.remove("envelope-locked");
    }, 1250);

    window.setTimeout(() => envelopeScreen.remove(), 2300);
  });
}
