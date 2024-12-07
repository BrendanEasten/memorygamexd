// Select DOM elements
const gameBoard = document.querySelector('.memory-game');
const resetButton = document.querySelector('.reset-button');
const bestScoreDisplay = document.getElementById('best-score');
const currentScoreDisplay = document.getElementById('current-score');
const congratsMessage = document.getElementById('congrats-message'); // New for message

let firstCard, secondCard;
let lockBoard = false;
let currentScore = 0; // Tracks current game score
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreDisplay.textContent = bestScore;

const images = [
  'img1.png', 'img2.png', 'img3.png', 'img4.png',
  'img5.png', 'img6.png', 'img7.png', 'img8.png', 'img9.png', 'img10.png'
];

function shuffleCards() {
  return [...images, ...images]
    .sort(() => Math.random() - 0.5)
    .map((image, index) => createCard(image, index));
}

function createCard(image, id) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = id;
  card.dataset.image = image;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back" style="background-image: url('${image}')"></div>
    </div>
  `;
  card.addEventListener('click', flipCard);
  return card;
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;

  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  // Increment the current score for a match
  currentScore++;
  currentScoreDisplay.textContent = currentScore;

  // Check if the game is completed
  if (currentScore === images.length) {
    congratsMessage.classList.remove('hidden'); // Show message
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
  gameBoard.innerHTML = '';
  const shuffledCards = shuffleCards();
  shuffledCards.forEach(card => gameBoard.appendChild(card));

  // Reset scores and hide message
  currentScore = 0;
  currentScoreDisplay.textContent = currentScore;
  congratsMessage.classList.add('hidden'); // Hide message
}

function updateBestScore() {
  if (currentScore > bestScore) {
    bestScore = currentScore; // Update best score if current score is higher
    localStorage.setItem('bestScore', bestScore); // Save to local storage
    bestScoreDisplay.textContent = bestScore; // Update the displayed value
  }
}
function resetBestScore() {
  localStorage.removeItem('bestScore'); // Removes the best score from local storage
  bestScore = 0; // Resets the variable in your script
  bestScoreDisplay.textContent = bestScore; // Updates the display on your page
}

resetGame();
resetButton.addEventListener('click', () => {
  updateBestScore();
  resetGame();
});