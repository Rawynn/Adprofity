(function () {
    $(function () {
        const questions = [{
                question: "Kto jest silniejszy?",
                answers: {
                    a: "Batman",
                    b: "Superman"
                },
                correctAnswer: "a"
            },
            {
                question: "Co nosi giermek rycerza-informatyka?",
                answers: {
                    a: "tarczę antywirusową",
                    b: "kopię zapasową"
                },
                correctAnswer: "b"
            },
            {
                question: "Im dalej w las, tym więcej...",
                answers: {
                    a: "kleszczy",
                    b: "drzew"
                },
                correctAnswer: "b"
            }
        ];

        function buildQuiz() {
            const output = [];

            questions.forEach((currentQuestion, questionNumber) => {
                const answers = [];

                for (letter in currentQuestion.answers) {
                    answers.push(
                        `<div class="answer quiz-button" name="question${questionNumber}" data-value="${letter}">
                            ${currentQuestion.answers[letter]}
                        </div>`
                    );
                }

                output.push(
                    `<div class="slide" data-slide='${questionNumber}'>
                        <div class="question"> ${currentQuestion.question} </div>
                        <div class="answers"> ${answers.join("")} </div>
                        <div class="slide-number">${questionNumber +1} / ${questions.length}</div>
                    </div>`
                );
            });

            quizContainer.html(output.join(""));
        }


        function showSlide(n) {
            $(document).find(slides[currentSlide]).removeClass("active-slide");
            $(document).find(slides[n]).addClass("active-slide");
            currentSlide = n;
        }

        function showNextSlide() {

            if ($(window).width() >= 1024) {
                $('.quiz-wrapper').animate({
                    "margin-left": "-160%"
                }, 500);
                $('.quiz-wrapper').animate({
                    "margin-left": "0",
                    "margin-right": "-160%"
                }, 0);
                setTimeout(function () {
                    $('.quiz-wrapper').animate({
                        "margin-right": "0"
                    }, 500);
                }, 500)
                setTimeout(function () {
                    showSlide(currentSlide + 1);
                }, 500);
            }
        }

        const quizContainer = $("#quiz");

        buildQuiz();

        const slides = $(document).find(".slide");
        let currentSlide = 0;

        showSlide(0);

        let userAnswers = [];

        $('.answer').on("click", function () {
            let slideNumber = $(document).find('.active-slide').attr('data-slide');
            let correct = questions[slideNumber]['correctAnswer'];
            userAnswers.push([$(this).attr('data-value'), correct]);
            if (parseInt(slideNumber) + 1 === questions.length) {
                showResult();
            } else {
                showNextSlide();
            }
        });

        function showResult() {
            let result = 0;
            userAnswers.forEach((answer) => {
                if (answer[0] === answer[1]) {
                    result++;
                }
            });
            if (result > 2) {
                $('.quiz-container').addClass('closed');
                $('body').removeClass("hide-scroll");
            } else {
                if ($(window).width() >= 1024) {
                    $('.quiz-wrapper').animate({
                        "opacity": "0"
                    }, 500);

                    setTimeout(function () {
                        quizContainer.html(`<div class="result"><p>Niestety nie mogę pokazać Ci CV.</p><p>Poprawnych odpowiedzi: ` + result + `.</p></div>`);
                    }, 500);

                    $('.quiz-wrapper').animate({
                        "opacity": "1"
                    }, 500);
                } else {
                    quizContainer.html(`<div class="result"><p>Niestety nie mogę pokazać Ci CV.</p><p>Poprawnych odpowiedzi: ` + result + `.</p></div>`);
                }
            }
        }
    });
})();