/**
 * EMPTY QUIZ TEMPLATE
 * Add your questions to the quizQuestions array below
 * 
 * Question Format:
 * {
 *     id: 1,
 *     question: "What is your question?",
 *     options: ["Option 1", "Option 2", "Option 3", "Option 4"],
 *     correct: 0  // Index of correct answer (0, 1, 2, or 3)
 * }
 */

// Quiz Questions Array - ADD YOUR QUESTIONS HERE
const quizQuestions = [
    // Example question (delete this and add your own)
    // {
    //     id: 1,
    //     question: "Example question?",
    //     options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    //     correct: 0
    // }
];

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizStarted = false;

// Initialize Quiz
function initQuiz() {
    if (quizQuestions.length === 0) {
        alert('No questions added yet! Please add questions to the quizQuestions array in script.js');
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    quizStarted = false;
    hideAllScreens();
    
    // Update question count on start screen
    document.getElementById('totalQuestionsInfo').textContent = quizQuestions.length;
    
    showScreen('startScreen');
}

// Screen Management
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).classList.add('active');
}

// Start Quiz
function startQuiz() {
    quizStarted = true;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    showScreen('quizScreen');
    loadQuestion();
}

// Load Current Question
function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const answerStatus = document.getElementById('answerStatus');

    questionText.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    answersContainer.innerHTML = '';
    answerStatus.classList.remove('show');
    answerStatus.textContent = '';

    // Create answer options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'answer-option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectAnswer(index);

        // Highlight previously selected answer
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }

        answersContainer.appendChild(optionElement);
    });

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;

    // Update button states
    updateNavigationButtons();
}

// Select Answer
function selectAnswer(optionIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const answersContainer = document.getElementById('answersContainer');
    const answerOptions = answersContainer.querySelectorAll('.answer-option');
    const answerStatus = document.getElementById('answerStatus');

    // Clear previous selections
    answerOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    // Select new answer
    answerOptions[optionIndex].classList.add('selected');
    userAnswers[currentQuestionIndex] = optionIndex;

    // Show immediate feedback
    if (optionIndex === question.correct) {
        answerOptions[optionIndex].classList.add('correct');
        answerStatus.textContent = '✓ Correct!';
        answerStatus.classList.add('show', 'correct-status');
        if (userAnswers[currentQuestionIndex] === null) {
            score++;
        }
    } else {
        answerOptions[optionIndex].classList.add('incorrect');
        answerOptions[question.correct].classList.add('correct');
        answerStatus.textContent = '✗ Incorrect. The correct answer is: ' + question.options[question.correct];
        answerStatus.classList.add('show', 'incorrect-status');
    }
}

// Update Navigation Buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Navigate to Previous Question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// Navigate to Next Question
function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert('Please select an answer before proceeding');
        return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// Finish Quiz
function finishQuiz() {
    // Calculate final score
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            score++;
        }
    });

    displayResults();
}

// Display Results
function displayResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const incorrect = quizQuestions.length - score;

    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestionsScore').textContent = quizQuestions.length;
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = score;
    document.getElementById('incorrectCount').textContent = incorrect;
    document.getElementById('accuracy').textContent = percentage + '%';

    // Determine message based on score
    let message = '';
    if (percentage >= 90) {
        message = 'Excellent! You have mastered the material!';
    } else if (percentage >= 75) {
        message = 'Great job! You have a solid understanding.';
    } else if (percentage >= 60) {
        message = 'Good effort! Review the material and try again.';
    } else {
        message = 'Keep practicing! You\'ll improve with each attempt.';
    }

    document.getElementById('scoreMessage').textContent = message;

    showScreen('resultsScreen');
}

// Review Answers
function reviewAnswers() {
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';

    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;

        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;

        let html = `
            <div class="review-question">Question ${index + 1}: ${question.question}</div>
            <div class="review-answer correct">✓ Correct Answer: ${question.options[question.correct]}</div>
        `;

        if (!isCorrect) {
            html += `<div class="review-answer incorrect">✗ Your Answer: ${question.options[userAnswer]}</div>`;
        }

        reviewItem.innerHTML = html;
        reviewContainer.appendChild(reviewItem);
    });

    showScreen('reviewScreen');
}

// Restart Quiz
function restartQuiz() {
    startQuiz();
}

// Exit Quiz
function exitQuiz() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        initQuiz();
    }
}

// Back to Home
function backToHome() {
    initQuiz();
}

// Back to Results
function backToResults() {
    showScreen('resultsScreen');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});
