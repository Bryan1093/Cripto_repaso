const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to get quiz data (multi-subject support)
app.get('/api/quiz/:subject/:unit', (req, res) => {
    const { subject, unit } = req.params;

    // Validate subject
    if (subject !== 'criptografia' && subject !== 'dispositivos') {
        return res.status(400).json({ error: 'Invalid subject. Must be criptografia or dispositivos.' });
    }

    // Validate unit
    if (unit !== '1' && unit !== '2') {
        return res.status(400).json({ error: 'Invalid unit. Must be 1 or 2.' });
    }

    const filePath = path.join(__dirname, 'data', subject, `unidad${unit}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error loading quiz data' });
        }

        try {
            const quizData = JSON.parse(data);
            res.json(quizData);
        } catch (parseErr) {
            res.status(500).json({ error: 'Error parsing quiz data' });
        }
    });
});

// Legacy endpoint for backward compatibility (redirects to criptografia)
app.get('/api/quiz/:unit', (req, res) => {
    const unit = req.params.unit;
    res.redirect(`/api/quiz/criptografia/${unit}`);
});

// API endpoint to validate answers
app.post('/api/submit', (req, res) => {
    const { unit, answers } = req.body;

    if (!unit || !answers) {
        return res.status(400).json({ error: 'Missing unit or answers' });
    }

    const filePath = path.join(__dirname, 'data', `unidad${unit}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error loading quiz data' });
        }

        try {
            const questions = JSON.parse(data);
            let score = 0;
            const results = [];

            questions.forEach(question => {
                const userAnswer = answers[question.id];
                let isCorrect = false;

                switch (question.type) {
                    case 'multiple-choice':
                        isCorrect = userAnswer === question.correctAnswer;
                        break;

                    case 'true-false':
                        isCorrect = userAnswer === question.correctAnswer;
                        break;

                    case 'fill-blank':
                        // Case-insensitive comparison, trim whitespace
                        const normalizedUser = (userAnswer || '').toLowerCase().trim();
                        const normalizedCorrect = question.correctAnswer.toLowerCase().trim();
                        isCorrect = normalizedUser === normalizedCorrect;
                        break;


                    case 'multiple-select':
                        // Check if arrays have same elements
                        // correctAnswers can be indices or text values
                        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswers)) {
                            let correctValues = question.correctAnswers;

                            // If correctAnswers contains numbers (indices), convert to actual values
                            if (question.correctAnswers.every(item => typeof item === 'number')) {
                                correctValues = question.correctAnswers.map(idx => question.options[idx]);
                            }

                            const sortedUser = [...userAnswer].sort();
                            const sortedCorrect = [...correctValues].sort();
                            isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
                        }
                        break;


                    case 'matching':
                        // For matching questions, check if user provided correct values
                        if (question.blanks) {
                            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.blanks);
                        } else if (question.pairs) {
                            isCorrect = question.pairs.every((pair, idx) => {
                                const userPair = userAnswer[idx];
                                return userPair && userPair.toLowerCase().trim() === pair.answer.toLowerCase().trim();
                            });
                        }
                        break;
                }

                if (isCorrect) {
                    score += question.points;
                }

                results.push({
                    questionId: question.id,
                    isCorrect,
                    userAnswer,
                    correctAnswer: question.correctAnswer || question.correctAnswers || question.blanks || question.pairs
                });
            });

            res.json({
                score,
                totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
                results
            });

        } catch (parseErr) {
            res.status(500).json({ error: 'Error processing answers' });
        }
    });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Quiz server running on http://localhost:${PORT}`);
});

module.exports = app;
