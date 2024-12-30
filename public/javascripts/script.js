const modal = document.getElementById('modal');

const openModal = document.getElementById('openModal');

const closeBtn = document.querySelector('.close');

openModal.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});