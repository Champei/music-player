// DOM Elements
const sentenceElement = document.getElementById("sentence");
const inputElement = document.getElementById("input");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const mistakesElement = document.getElementById("mistakes");

// Game variables
let timer;
let startTime;
let sentence = "";
let mistakes = 0;

// Sample sentences
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and concentration.",
    "JavaScript is a versatile programming language.",
    "Accuracy matters more than speed in typing tests.",
    "Practice makes perfect, even in typing."
];

// Function to start the game
function startGame() {
    sentence = sentences[Math.floor(Math.random() * sentences.length)];
    sentenceElement.textContent = sentence;
    inputElement.value = "";
    inputElement.disabled = false;
    inputElement.focus();
    mistakes = 0;

    startBtn.disabled = true;
    retryBtn.disabled = true;

    // Timer
    timerElement.textContent = 0;
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
}

// Update timer every second
function updateTimer() {
    const currentTime = new Date();
    const seconds = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = seconds;
}

// Function to calculate results
function calculateResults() {
    clearInterval(timer);
    const typedText = inputElement.value;

    // Mistakes calculation
    mistakes = 0;
    for (let i = 0; i < sentence.length; i++) {
        if (typedText[i] !== sentence[i]) {
            mistakes++;
        }
    }

    const wordsTyped = typedText.split(" ").length;
    const timeInMinutes = (new Date() - startTime) / 60000; // milliseconds to minutes
    const wpm = Math.round(wordsTyped / timeInMinutes);

    const accuracy = Math.max(0, Math.round(((sentence.length - mistakes) / sentence.length) * 100));

    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy;
    mistakesElement.textContent = mistakes;

    inputElement.disabled = true;
    retryBtn.disabled = false;
    startBtn.disabled = false;
}

// Event Listeners
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);

inputElement.addEventListener("input", () => {
    if (inputElement.value === sentence) {
        calculateResults();
    }
});
