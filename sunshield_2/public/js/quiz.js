const questionsNovice = [
    { question: "The UV index is higher during the night. ", answer: "False" },
    { question: "You only need sunscreen on sunny days.", answer: "False" },
    { question: "Wearing a hat can help protect you from the sun.", answer: "True" },
    { question: "Staying in the shade can reduce your exposure to UV rays.", answer: "True" },
    { question: "Sunscreen should be applied only once a day. ", answer: "False" },
    { question: "Sunglasses protect your eyes from harmful UV rays.", answer: "True" },
    { question: "The UV index is highest during the middle of the day. ", answer: "True" },
    { question: "You don’t need to worry about UV rays on cloudy days. ", answer: "False" }
];

const questionsExpert = [
    { question: "A UV index of 2 means there is no need for sun protection.", answer: "False" },
    { question: "Sunscreen should be reapplied every two hours when you're outside. ", answer: "True" },
    { question: "Snow can reflect UV rays and increase sun exposure.  ", answer: "True" },
    { question: "UV rays cannot penetrate water, so you don/'t need sunscreen while swimming.  ", answer: "False" },
    { question: "Sunscreen with SPF 30 blocks all UV rays.", answer: "False" },
    { question: "The UV index measures both UV-A and UV-B rays.  ", answer: "True" },
    { question: "Clothing labeled with UPF (Ultraviolet Protection Factor) offers extra protection from UV rays.", answer: "True" },
    { question: "People with darker skin don’t need to use sunscreen. ", answer: "False" }
];
document.addEventListener('DOMContentLoaded', function() {
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

    let questions = questionsNovice;
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
});
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