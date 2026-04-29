const weddingDate = new Date("2026-06-01T13:15:00").getTime();

const countdownElement = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    countdownElement.innerHTML = "Hôm nay là ngày cưới!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdownElement.innerHTML = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}

updateCountdown();
setInterval(updateCountdown, 1000);