let cells = document.querySelectorAll(".cell");
const playerText = document.getElementsByClassName("player")[0];
const restartBtn = document.getElementsByClassName("restartBtn")[0];

let currentPlayer = "x";
let gameIsOver = false;
let animationFrameId;
let winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let winSound = new Audio("./sound/game-win-36082.mp3"); // Store the audio object globally

const updatePlayerText = () => {
  playerText.innerHTML = `Player ${currentPlayer}'s turn`;
};

const checkForWinner = () => {
  winningConditions.forEach((combination) => {
    let check = combination.every(
      (index) => cells[index].innerHTML.trim() === currentPlayer
    );
    if (check) {
      playerText.innerHTML = `${currentPlayer} won`;
      gameIsOver = true;

      // Start animation when player wins
      setTimeout(() => {
        startAnimation();
      }, 6);

      combination.forEach((index) => {
        cells[index].classList.add("winning-cell");
        cells[index].style.color = "#C22828";
      });
    }
  });
};

const checkForDraw = () => {
  if (![...cells].some((cell) => cell.innerHTML.trim() === "") && !gameIsOver) {
    playerText.innerHTML = "It's a draw!";
    gameIsOver = true;
  }
};

updatePlayerText();

cells = Array.from(cells);
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    var click = new Audio("./sound/mixkit-arcade-game-jump-coin-216.wav");
    click.volume = 1.0;
    click.play();
    if (gameIsOver || cell.innerHTML.trim() !== "") return;
    cell.innerHTML = currentPlayer;
    checkForWinner();
    checkForDraw();

    if (!gameIsOver) {
      currentPlayer = currentPlayer === "x" ? "o" : "x";
      updatePlayerText();
    }
  });
});

restartBtn.addEventListener("click", () => {
  restartGame();
});

const restartGame = () => {
  stopAnimation(); // Stop animation when restarting the game
  stopSound(); // Stop the sound when restarting the game
  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winning-cell");
    cell.style.color = "";
  });

  currentPlayer = "x";
  gameIsOver = false;

  updatePlayerText();
};

const stopAnimation = () => {
  cancelAnimationFrame(animationFrameId); // Stop the animation loop
  context.clearRect(0, 0, W, H); // Clear the canvas
  canvas.style.display = "none"; // Hide the canvas
};

const stopSound = () => {
  winSound.pause(); // Pause the sound
  winSound.currentTime = 0; // Reset the sound to the beginning
};

const startAnimation = () => {
  winSound.play(); // Play the win sound
  setTimeout(() => {
    stopAnimation();
  }, 6000);
  canvas.style.display = "block"; // Show the canvas
  particles = []; // Reset particles
  for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
  }
  Draw(); // Start drawing confetti
};

let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
let particles = [];

const possibleColors = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Gold",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W; // x
  this.y = Math.random() * H - H; // y
  this.r = randomFromTo(11, 33); // radius
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  const results = [];

  animationFrameId = requestAnimationFrame(Draw); // Store the animation frame id

  context.clearRect(0, 0, W, window.innerHeight);

  for (var i = 0; i < maxConfettis; i++) {
    results.push(particles[i].draw());
  }

  let particle = {};
  let remainingFlakes = 0;
  for (var i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }

  return results;
}

window.addEventListener(
  "resize",
  function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// Initialize canvas
canvas.width = W;
canvas.height = H;
canvas.style.display = "none"; // Hide the canvas initially
