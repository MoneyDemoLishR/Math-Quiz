let questions; // Global variable to store loaded questions
let usedQuestions = []; // Global variable to store used questions
let selectedQuestions = []; // Keep track of selected questions during the game
let ansOpt;
let answer;
let qNo = document.getElementById("Qno");
let score = document.getElementById("score");
let buttons = document.getElementsByTagName("button");
let start = document.getElementById("start-btn");
let fScore = document.getElementById("final-score");
let startBox = document.getElementById("start-game");
let gameBox = document.getElementById("in-game");
let endBox = document.getElementById("end-game");
let progress = document.getElementById("progress");
let message = document.getElementById("message");
let summary = document.getElementById("summary");
let t;

// Function to load questions from the JSON file
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    questions = await response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}

// Function to get a random question that hasn't been used yet
function getRandomQuestion() {
    const unusedQuestions = questions.filter(q => !usedQuestions.includes(q));
    if (unusedQuestions.length === 0) {
      // Reset usedQuestions if all questions have been used
      usedQuestions = [];
    }
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const randomQuestion = unusedQuestions[randomIndex];
    usedQuestions.push(randomQuestion);
    const selectedQuestion = { ...randomQuestion, status: null }; // Keep track of selected questions with status
    selectedQuestions.push(selectedQuestion);
  
    // Check if the status property exists, and set it to null if not
    if (!Object.prototype.hasOwnProperty.call(selectedQuestion, 'status')) {
      Object.defineProperty(selectedQuestion, 'status', {
        value: null,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  
    return randomQuestion;
}
  

function restart() {
  score.innerHTML = "0";
  qNo.innerHTML = "0";
  usedQuestions = []; // Clear used questions for a new game
  selectedQuestions = []; // Clear selected questions for a new game
  nextQuestion();

  gameBox.style.display = "block";
  startBox.style.display = "none";
  endBox.style.display = "none";
  timer.style.display = "block";
}

function whenFinished() {
  console.log("Finished.");
  gameBox.style.display = "none";
  startBox.style.display = "none";
  endBox.style.display = "flex";
  lastmessage();
}

function nextQuestion() {
  progress.style.width = "100%";
  timed();
  fScore.innerHTML = score.innerHTML;
  if (qNo.innerText == "10") {
    whenFinished();
    return;
  }

  const currentQuestion = getRandomQuestion();
  if (!currentQuestion) {
    console.error('No more questions available.');
    return;
  }

  question.innerHTML = currentQuestion.question;
  answer = currentQuestion.answer;
  question.innerHTML = question.innerHTML + " = ?";

  getOptions();
  getQNo();
}

function getOptions() {
  for (let i = 0; i < 4; i++ && i != ansOpt) {
    if (answer > 100) {
      buttons[i].innerHTML = answer + Math.floor(Math.random() * answer * 0.4);
    } else if (answer > 30 && answer < 100) {
      buttons[i].innerHTML = answer + Math.floor(Math.random() * answer * 0.6);
    } else {
      buttons[i].innerHTML = Math.floor(Math.random() * 100);
    }

    if (answer < 0) {
      buttons[i].innerHTML = "-" + buttons[i].innerHTML;
    }
  }
  ansOpt = Math.floor(Math.random() * 4);
  buttons[ansOpt].innerHTML = answer;
}

function getQNo() {
  qNo.innerHTML = parseInt(qNo.innerHTML) + 1;
}

function getScore() {
  score.innerHTML = parseInt(score.innerHTML) + 1;
}

function doWhenCorrect(i) {
  buttons[i].style.color = "#fff";
  buttons[i].style.backgroundColor = "green";
  getScore();
  // Update status for the current question
  selectedQuestions[qNo.innerHTML - 1].status = "correct";
}

function doWhenIncorrect(i) {
  buttons[i].style.color = "#fff";
  buttons[i].style.backgroundColor = "#fb3640";
  // Update status for the current question
  selectedQuestions[qNo.innerHTML - 1].status = "incorrect";
}

function outro(i) {
  setTimeout(() => {
    nextQuestion();
    buttons[i].style.color = "#000";
    buttons[i].style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }, 500);
}

function lastmessage() {
  clearInterval(t);

  summary.innerHTML = ""; // Clear previous summary

  if (score.innerHTML >= 8) {
    let emoji = "&#128525";
    message.innerHTML = "WOW !! UNBELIEVABLE !!" + emoji;
  } else if (score.innerHTML >= 5) {
    let emoji = "&#128531";
    message.innerHTML = "TOO CLOSE !!" + emoji;
  } else if (score.innerHTML >= 1) {
    let emoji = "&#128549";
    message.innerHTML = "Better luck next time " + emoji;
  } else {
    let emoji = "&#128577";
    message.innerHTML = "Bad Luck " + emoji;
  }

  // Display correct answers for each selected question
  selectedQuestions.forEach((q, index) => {
    let answerSummary = document.createElement("p");
    answerSummary.innerHTML = `Question ${index + 1}: ${q.question} = ${q.answer} (${q.status})`;
    summary.appendChild(answerSummary);
  });
}

function timed() {
  t = setInterval(() => {
    progress.style.width = (parseInt(progress.style.width) - 1) + "%";
    if (parseInt(progress.style.width) == 0) {
      clearInterval(t);
      nextQuestion();
    }
  }, 200)
}

buttons[0].addEventListener('click', () => {
  if (buttons[0].innerText == answer) {
    doWhenCorrect(0);
  } else {
    doWhenIncorrect(0);
  }
  clearInterval(t);
  outro(0);
});
buttons[1].addEventListener('click', () => {
  if (buttons[1].innerText == answer) {
    doWhenCorrect(1);
  } else {
    doWhenIncorrect(1);
  }
  clearInterval(t);
  outro(1);
});
buttons[2].addEventListener('click', () => {
  if (buttons[2].innerText == answer) {
    doWhenCorrect(2);
  } else {
    doWhenIncorrect(2);;
  }
  clearInterval(t);
  outro(2);
});
buttons[3].addEventListener('click', () => {
  if (buttons[3].innerText == answer) {
    doWhenCorrect(3);
  } else {
    doWhenIncorrect(3);
  }
  clearInterval(t);
  outro(3);
});

// Call loadQuestions before starting the game
async function startGame() {
  await loadQuestions();
  restart();
}

// Event listener for the start button
start.addEventListener('click', startGame);
