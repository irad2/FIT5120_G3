let questionsNovice = [];
let questionsExpert = [];
let questions = [];

Promise.all([
    fetch('https://fit5120-quiz-questions.s3.amazonaws.com/novicequestions.json').then(response => response.json()),
    fetch('https://fit5120-quiz-questions.s3.amazonaws.com/expertquestions.json').then(response => response.json())
])
.then(([noviceData, expertData]) => {
    questionsNovice = noviceData;
    questionsExpert = expertData;
    initializeQuiz();
})
.catch(error => console.error('Error fetching questions:', error));

function initializeQuiz() {
    const btnNovice = document.querySelector('.btn-1 button');
    const btnExpert = document.querySelector('.btn-2 button');
    const firstBox = document.querySelector('.first-box');
    const whole = document.querySelector('.whole');
    const feedback = document.querySelector('.feedback');
    const questionContent = document.querySelector('.question-content1 p');
    const fbContent = document.querySelector('.fb-content p');
    const nextBtn = document.querySelector('.feedback .next-btn');
    const answerButtons = document.querySelectorAll('.whole .answer-btn');
    const resultsContainer = document.querySelector('.results');

    let currentQuestionIndex = 0;
    let userAnswers = [];

    btnExpert.addEventListener('click', function() {
        questions = questionsExpert;
        startQuiz();
    });

    btnNovice.addEventListener('click', function() {
        questions = questionsNovice;
        startQuiz();
    });

    function startQuiz() {
        firstBox.style.display = 'none';
        whole.style.display = 'block';
        currentQuestionIndex = 0;
        userAnswers = [];
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            questionContent.textContent = questions[currentQuestionIndex].question;
            const questionTitle = document.querySelector('.question-title p');
            questionTitle.textContent = `Question ${currentQuestionIndex + 1} Of ${questions.length}`;
            const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
            document.querySelector('.progress').style.width = `${progressPercentage}%`;

            whole.style.display = 'block';
            feedback.style.display = 'none';
            resultsContainer.style.display = 'none';

            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.textContent = "See Results";
            } else {
                nextBtn.textContent = "Next Question";
            }
        } else {
            displayResults();
        }
    }

    answerButtons.forEach(button => {
        button.onclick = () => {
            checkAnswer(button.getAttribute('data-answer'));
        };
    });

    function checkAnswer(selectedAnswer) {
        const correctAnswer = questions[currentQuestionIndex].answer;
        userAnswers.push(selectedAnswer);
        const answerTitle = document.querySelector('.fb-title p');
        answerTitle.textContent = `Question ${currentQuestionIndex + 1} Of ${questions.length}`;
        fbContent.textContent = (selectedAnswer === correctAnswer) ? 'Correct' : 'Incorrect';
        feedback.style.display = 'block';
        whole.style.display = 'none';
        currentQuestionIndex++;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex >= questions.length) {
            displayResults();
        } else {
            displayQuestion();
        }
    });

    function displayResults() {
        const resultContainer = document.querySelector('.result-content');
        resultContainer.innerHTML = '';
        let correctCount = 0;

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const correct = question.answer === userAnswer;
            if (correct) correctCount++;
            resultContainer.innerHTML += `
                <div class="result-item">
                    <p><b>Question ${index + 1}:</b> ${question.question} </p> <p>Your answer: ${userAnswer} </p> <p>Correct answer: ${question.answer}</p>
                </div>`;
        });

        const scoreElement = document.createElement('h2');
        scoreElement.textContent = `You got ${correctCount} out of ${questions.length}.`;
        resultContainer.insertBefore(scoreElement, resultContainer.firstChild);

        feedback.style.display = 'none';
        whole.style.display = 'none';
        resultsContainer.style.display = 'block';
    }

    document.querySelector('.restart-btn').addEventListener('click', function() {
        resultsContainer.style.display = 'none';
        firstBox.style.display = 'block';
        currentQuestionIndex = 0;
        userAnswers = [];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const learnMoreButton = document.querySelector('.learn-more');

    learnMoreButton.addEventListener('click', function() {
        window.location.href = 'protect%20_your_skin.html'; // 替换为您想要跳转的网址
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const backHomeButton = document.querySelector('.back-home');

    backHomeButton.addEventListener('click', function() {
        window.location.href = 'home.html';
    });
});