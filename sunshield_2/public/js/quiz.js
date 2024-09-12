const questionsNovice = [
    { question: "The UV index is higher during the night. ", answer: "False" },
    { question: "You only need sunscreen on sunny days.", answer: "False" },
    { question: "Wearing a hat can help protect you from the sun.", answer: "True" },
    { question: "HStaying in the shade can reduce your exposure to UV rays.", answer: "True" },
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

    const firstBox = document.querySelector('.first-box');
    const whole = document.querySelector('.whole');
    const feedback = document.querySelector('.feedback');
    const questionContent = document.querySelector('.question-content1 p');
    const fbContent = document.querySelector('.fb-content p');
    const nextBtn = document.querySelector('.feedback .next-btn');
    const answerButtons = document.querySelectorAll('.whole .answer-btn');
    const btnExpert = document.querySelector('.btn-2 button'); // 获取专家按钮

    let questions = questionsNovice;
    let currentQuestionIndex = 0;

    btnExpert.addEventListener('click', function() {
        questions = questionsExpert;
        firstBox.style.display = 'none';
        whole.style.display = 'block';
        currentQuestionIndex = 0;
        displayQuestion();
    });

    btnNovice.addEventListener('click', function() {
        firstBox.style.display = 'none';
        whole.style.display = 'block';
        currentQuestionIndex = 0;
        displayQuestion();
    });

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            questionContent.textContent = questions[currentQuestionIndex].question;
            const questionTitle = document.querySelector('.question-title p');
            questionTitle.textContent = `Question ${currentQuestionIndex + 1} Of ${questions.length}`;
            const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
            document.querySelector('.progress').style.width = `${progressPercentage}%`;

            whole.style.display = 'block';
            feedback.style.display = 'none';

            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.textContent = "Result";
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
        const answerTitle = document.querySelector('.fb-title p');
        answerTitle.textContent = `Question ${currentQuestionIndex + 1} Of ${questions.length}`;
        fbContent.textContent = (selectedAnswer === correctAnswer) ? 'Correct' : 'Incorrect';
        feedback.style.display = 'block';
        whole.style.display = 'none';
        currentQuestionIndex++;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex >= questions.length) {
            restartQuiz();
        } else {
            displayQuestion();
        }
    });

    function displayResults() {
        const resultContainer = document.querySelector('.result-content');
        resultContainer.innerHTML = ''; // 清空先前的结果
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index]; // 假设我们存储了用户的答案
            const correct = question.answer === userAnswer;
            resultContainer.innerHTML += `<div class="result-item">
                <p><b>Question ${index + 1}:</b> ${question.question}</p>
                <p>Your answer: ${userAnswer} - ${correct ? 'Correct' : 'Incorrect'}</p>
            </div>`;
        });

        feedback.style.display = 'none';
        document.querySelector('.results').style.display = 'block';
    }
    document.querySelector('.restart-btn').addEventListener('click', function() {
        currentQuestionIndex = 0;
        displayQuestion();
        document.querySelector('.results').style.display = 'none';
        firstBox.style.display = 'block';
    });


    function restartQuiz() {
        currentQuestionIndex = 0;
        firstBox.style.display = 'block';
        feedback.style.display = 'none';
        nextBtn.textContent = "Next Question";
    }
});