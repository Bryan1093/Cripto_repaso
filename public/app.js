// Global state
let currentUnit = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let quizResults = null;

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentUnit = urlParams.get('unit');

    if (currentUnit) {
        loadQuiz(currentUnit);
    }
});

// Load quiz data from API
async function loadQuiz(unit) {
    try {
        const response = await fetch(`/api/quiz/${unit}`);
        if (!response.ok) throw new Error('Failed to load quiz');

        questions = await response.json();

        // Update header
        document.getElementById('unitTitle').textContent = `Unidad ${unit}`;

        // Display first question
        displayQuestion(0);
        updateNavigation();
    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Error al cargar el cuestionario. Por favor, intenta de nuevo.');
    }
}

// Display a question
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const question = questions[index];

    // Update question number and progress
    document.getElementById('questionNumber').textContent = `Pregunta ${index + 1}`;
    document.getElementById('questionProgress').textContent = `Pregunta ${index + 1}/${questions.length}`;
    document.getElementById('questionText').textContent = question.question;

    // Update progress bar
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Render answer section based on question type
    const answerSection = document.getElementById('answerSection');
    answerSection.innerHTML = '';

    // Add image if question has one
    if (question.image) {
        const img = document.createElement('img');
        img.src = question.image;
        img.style.maxWidth = '100%';
        img.style.marginBottom = '1.5rem';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        answerSection.appendChild(img);
    }

    switch (question.type) {
        case 'multiple-choice':
            renderMultipleChoice(question);
            break;
        case 'true-false':
            renderTrueFalse(question);
            break;
        case 'fill-blank':
            renderFillBlank(question);
            break;
        case 'multiple-select':
            renderMultipleSelect(question);
            break;
        case 'matching':
            renderMatching(question);
            break;
    }

    // Restore previous answer if exists
    restoreAnswer(question);
}

// Render multiple choice question
function renderMultipleChoice(question) {
    const answerSection = document.getElementById('answerSection');

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${question.id}`;
        input.id = `option-${index}`;
        input.value = option;
        input.onchange = () => saveAnswer(question.id, option);

        const label = document.createElement('label');
        label.className = 'answer-label';
        label.htmlFor = `option-${index}`;
        label.textContent = option;

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        answerSection.appendChild(optionDiv);
    });
}

// Render true/false question
function renderTrueFalse(question) {
    const answerSection = document.getElementById('answerSection');

    ['Verdadero', 'Falso'].forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${question.id}`;
        input.id = `option-${index}`;
        input.value = option === 'Verdadero';
        input.onchange = () => saveAnswer(question.id, option === 'Verdadero');

        const label = document.createElement('label');
        label.className = 'answer-label';
        label.htmlFor = `option-${index}`;
        label.textContent = option;

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        answerSection.appendChild(optionDiv);
    });
}

// Render fill-in-the-blank question
function renderFillBlank(question) {
    const answerSection = document.getElementById('answerSection');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Escribe tu respuesta aquí...';
    input.id = `answer-${question.id}`;
    input.oninput = (e) => saveAnswer(question.id, e.target.value);

    answerSection.appendChild(input);
}

// Render multiple select question
function renderMultipleSelect(question) {
    const answerSection = document.getElementById('answerSection');

    const instruction = document.createElement('p');
    instruction.style.marginBottom = '1rem';
    instruction.style.color = 'var(--text-secondary)';
    instruction.textContent = 'Selecciona todas las opciones correctas:';
    answerSection.appendChild(instruction);

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = `question-${question.id}`;
        input.id = `option-${index}`;
        input.value = option;
        input.onchange = () => {
            const selected = Array.from(document.querySelectorAll(`input[name="question-${question.id}"]:checked`))
                .map(cb => cb.value);
            saveAnswer(question.id, selected);
        };

        const label = document.createElement('label');
        label.className = 'answer-label';
        label.htmlFor = `option-${index}`;
        label.textContent = option;

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        answerSection.appendChild(optionDiv);
    });
}

// Render matching question
function renderMatching(question) {
    const answerSection = document.getElementById('answerSection');

    if (question.blanks) {
        // Simple fill-in-the-blanks matching
        const instruction = document.createElement('p');
        instruction.style.marginBottom = '1rem';
        instruction.style.color = 'var(--text-secondary)';
        instruction.textContent = 'Completa los espacios en blanco:';
        answerSection.appendChild(instruction);

        const answers = [];
        question.blanks.forEach((blank, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-input';
            input.placeholder = `Espacio ${index + 1}`;
            input.style.marginBottom = '1rem';
            input.oninput = (e) => {
                answers[index] = e.target.value;
                saveAnswer(question.id, answers);
            };
            answerSection.appendChild(input);
        });
    } else if (question.pairs) {
        // Pair matching with dropdown if options provided
        const instruction = document.createElement('p');
        instruction.style.marginBottom = '1rem';
        instruction.style.color = 'var(--text-secondary)';
        instruction.textContent = question.options ? 'Selecciona la respuesta correcta para cada descripción:' : 'Completa cada descripción con la respuesta correcta:';
        answerSection.appendChild(instruction);

        const answers = [];
        question.pairs.forEach((pair, index) => {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'matching-pair';

            const description = document.createElement('div');
            description.className = 'matching-description';
            description.textContent = pair.description;

            if (question.options) {
                // Use dropdown select
                const select = document.createElement('select');
                select.className = 'text-input matching-input';

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecciona...';
                select.appendChild(defaultOption);

                question.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    select.appendChild(opt);
                });

                select.onchange = (e) => {
                    answers[index] = e.target.value;
                    saveAnswer(question.id, answers);
                };

                pairDiv.appendChild(description);
                pairDiv.appendChild(select);
            } else {
                // Use text input
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'text-input matching-input';
                input.placeholder = 'Respuesta...';
                input.oninput = (e) => {
                    answers[index] = e.target.value;
                    saveAnswer(question.id, answers);
                };

                pairDiv.appendChild(description);
                pairDiv.appendChild(input);
            }

            answerSection.appendChild(pairDiv);
        });
    }
}

// Save user answer
function saveAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
}

// Restore previous answer
function restoreAnswer(question) {
    const savedAnswer = userAnswers[question.id];
    if (!savedAnswer) return;

    switch (question.type) {
        case 'multiple-choice':
        case 'true-false':
            const radio = document.querySelector(`input[name="question-${question.id}"][value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
            break;

        case 'fill-blank':
            const textInput = document.getElementById(`answer-${question.id}`);
            if (textInput) textInput.value = savedAnswer;
            break;

        case 'multiple-select':
            if (Array.isArray(savedAnswer)) {
                savedAnswer.forEach(value => {
                    const checkbox = document.querySelector(`input[name="question-${question.id}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            break;

        case 'matching':
            const inputs = document.querySelectorAll('#answerSection input[type="text"]');
            if (Array.isArray(savedAnswer)) {
                inputs.forEach((input, index) => {
                    if (savedAnswer[index]) input.value = savedAnswer[index];
                });
            }
            break;
    }
}

// Navigation functions
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
        updateNavigation();
    } else {
        submitQuiz();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
        updateNavigation();
    }
}

function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // Disable previous button completely (no going back)
    prevButton.disabled = true;
    prevButton.style.opacity = '0.3';
    prevButton.style.cursor = 'not-allowed';

    // Update next button text
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerHTML = `
            Finalizar
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        `;
    } else {
        nextButton.innerHTML = `
            Siguiente
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;
    }
}

// Submit quiz
async function submitQuiz() {
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unit: currentUnit,
                answers: userAnswers
            })
        });

        if (!response.ok) throw new Error('Failed to submit quiz');

        quizResults = await response.json();
        showResults();
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Error al enviar el cuestionario. Por favor, intenta de nuevo.');
    }
}

// Show results modal
function showResults() {
    const modal = document.getElementById('resultsModal');
    const scoreValue = document.getElementById('finalScore');
    const scorePercentage = document.getElementById('scorePercentage');
    const resultsSummary = document.getElementById('resultsSummary');

    // Calculate percentage
    const percentage = Math.round((quizResults.score / quizResults.totalPoints) * 100);

    // Update score display
    scoreValue.textContent = quizResults.score;
    scorePercentage.textContent = `${percentage}%`;

    // Animate score circle
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (percentage / 100) * circumference;

    // Add SVG gradient definition
    const svg = document.querySelector('.score-svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    setTimeout(() => {
        document.getElementById('scoreCircle').style.strokeDashoffset = offset;
    }, 100);

    // Display results summary
    resultsSummary.innerHTML = '';
    const correctCount = quizResults.results.filter(r => r.isCorrect).length;
    const incorrectCount = quizResults.results.length - correctCount;

    const summaryHTML = `
        <div style="display: flex; justify-content: space-around; margin-bottom: 1.5rem;">
            <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--accent-success);">${correctCount}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Correctas</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--accent-error);">${incorrectCount}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Incorrectas</div>
            </div>
        </div>
    `;

    resultsSummary.innerHTML = summaryHTML;

    // Show modal
    modal.classList.add('active');
}

// Review answers
function reviewAnswers() {
    const modal = document.getElementById('resultsModal');
    modal.classList.remove('active');

    // Go to first question
    displayQuestion(0);
    updateNavigation();
}

// Go home
function goHome() {
    window.location.href = '/';
}
