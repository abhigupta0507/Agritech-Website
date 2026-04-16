import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/quizzes.css";

export default function QuizzesPage() {
  const { t, i18n } = useTranslation();
  const { authFetch } = useFarmerAuth();
  const lang = i18n.language;

  // States
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch quizzes list (localized)
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          `${API_BASE_URL}/api/gamification/quizzes`,
          {
            headers: { "Accept-Language": lang },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data.quizzes ?? []);
        }
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [authFetch, lang]);

  // 2. Load selected quiz detail (localized)
  const loadQuizDetail = useCallback(
    async (quizId) => {
      setQuizLoading(true);
      try {
        const res = await authFetch(
          `${API_BASE_URL}/api/gamification/quizzes/${quizId}`,
          {
            headers: { "Accept-Language": lang },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setQuizData(data.quiz);
          setAnswers({});
          setSubmitted(false);
          setResult(null);
        } else {
          alert(t("Failed to load quiz"));
        }
      } catch (err) {
        console.error("Failed to load quiz:", err);
        alert(t("Network error"));
      } finally {
        setQuizLoading(false);
      }
    },
    [authFetch, t, lang],
  );

  const handleQuizSelect = (quiz) => {
    if (!quiz.unlocked) {
      alert(t("Complete the previous quiz to unlock this one."));
      return;
    }
    setSelectedQuiz(quiz);
    loadQuizDetail(quiz._id);
  };

  const handleAnswer = (questionIdx, optionIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  // 3. Submit quiz
  const handleSubmit = async () => {
    const answered = Object.keys(answers).length;
    if (answered < quizData.questions.length) {
      alert(t("Please answer all questions"));
      return;
    }

    const answersArray = quizData.questions.map((_, i) => answers[i]);
    setSubmitting(true);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/gamification/quizzes/${selectedQuiz._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": lang,
          },
          body: JSON.stringify({ answers: answersArray }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setSubmitted(true);
      } else {
        alert(t("Failed to submit quiz"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(t("Network error submitting quiz"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedQuiz(null);
    setQuizData(null);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  // ── View Logic ──

  if (submitted && result) {
    return (
      <div className="qp-container">
        <div className="qp-result-wrapper">
          <div
            className={`qp-result-card ${result.passed ? "qp-result-pass" : "qp-result-fail"}`}
          >
            <div className="qp-result-icon">
              {result.perfect ? "🏆" : result.passed ? "✅" : "❌"}
            </div>
            <div className="qp-result-score">{result.score}%</div>
            <div className="qp-result-title">
              {result.perfect
                ? t("🏆 Perfect Score!")
                : result.passed
                  ? t("✅ Passed!")
                  : t("❌ Not Passed")}
            </div>
            <div className="qp-result-subtitle">
              {result.correct}/{result.total} {t("correct")} · {t("Passing")}:{" "}
              {result.passingScore}%
            </div>

            {result.pointsAwarded > 0 && (
              <div className="qp-points-badge">
                <span className="qp-badge-icon">⭐</span>
                <span className="qp-badge-text">
                  +{result.pointsAwarded} {t("points")}
                </span>
              </div>
            )}
          </div>

          <div className="qp-breakdown">
            <h3 className="qp-breakdown-title">{t("Answer Breakdown")}</h3>
            <div className="qp-breakdown-list">
              {result.breakdown.map((item, i) => (
                <div
                  key={i}
                  className={`qp-breakdown-item ${item.isCorrect ? "qp-correct" : "qp-wrong"}`}
                >
                  <div className="qp-breakdown-header">
                    <span className="qp-breakdown-icon">
                      {item.isCorrect ? "✓" : "✕"}
                    </span>
                    <span className="qp-breakdown-question">
                      {item.question}
                    </span>
                  </div>
                  <div className="qp-breakdown-answer">
                    <span className="qp-your-answer">
                      {t("Your answer")}: {item.yourAnswer}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="qp-correct-answer">
                      {t("Correct")}: {item.correctAnswer}
                    </div>
                  )}
                  {item.explanation && (
                    <div className="qp-explanation">💡 {item.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            className="qp-btn qp-btn-primary qp-btn-lg"
            onClick={handleReset}
          >
            ← {t("Back to Quizzes")}
          </button>
        </div>
      </div>
    );
  }

  if (selectedQuiz && quizData) {
    const answered = Object.keys(answers).length;
    const total = quizData.questions.length;
    const progress = (answered / total) * 100;

    return (
      <div className="qp-container">
        <div className="qp-quiz-header">
          <button
            className="qp-back-btn"
            onClick={handleReset}
            disabled={submitting}
          >
            ← {t("Back")}
          </button>
          <div className="qp-quiz-info">
            <h2 className="qp-quiz-title">{selectedQuiz.title}</h2>
            <div className="qp-progress-text">
              {answered}/{total} {t("answered")}
            </div>
          </div>
        </div>

        <div className="qp-progress-bar">
          <div className="qp-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="qp-quiz-content">
          {quizLoading ? (
            <div className="qp-loading">
              <div className="qp-spinner" />
              <p>{t("Loading quiz...")}</p>
            </div>
          ) : (
            <>
              {quizData.questions.map((question, qIdx) => (
                <div key={qIdx} className="qp-question-block">
                  <div className="qp-question-header">
                    <span className="qp-question-number">Q{qIdx + 1}</span>
                    <span
                      className={`qp-question-status ${answers[qIdx] !== undefined ? "qp-answered" : "qp-unanswered"}`}
                    >
                      {answers[qIdx] !== undefined ? "✓" : "○"}
                    </span>
                  </div>
                  <p className="qp-question-text">{question.question}</p>
                  <div className="qp-options">
                    {question.options.map((option, oIdx) => (
                      <button
                        key={oIdx}
                        className={`qp-option ${answers[qIdx] === oIdx ? "qp-option-selected" : ""}`}
                        onClick={() => handleAnswer(qIdx, oIdx)}
                        disabled={submitted}
                      >
                        <span className="qp-option-radio">
                          {answers[qIdx] === oIdx && (
                            <span className="qp-radio-dot" />
                          )}
                        </span>
                        <span className="qp-option-label">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                className={`qp-btn qp-btn-primary qp-btn-lg ${answered < total ? "qp-btn-disabled" : ""}`}
                onClick={handleSubmit}
                disabled={submitting || answered < total}
              >
                {submitting ? t("Submitting...") : t("Submit Quiz")}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="qp-fade-in">
      <div className="qp-page-header">
        <div className="qp-page-breadcrumb">
          <a href="/fasalrath/dashboard">{t("Dashboard")}</a>
          <span>/</span>
          <span>{t("Knowledge Quizzes")}</span>
        </div>
        <h1 className="qp-page-title">📚 {t("Knowledge Quizzes")}</h1>
        <p className="qp-page-subtitle">{t("Learn. Earn points. Level up.")}</p>
      </div>

      {loading ? (
        <div className="qp-loading-page">
          <div className="qp-spinner" />
          <p>{t("Loading quizzes...")}</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="qp-empty-state">
          <div className="qp-empty-icon">📖</div>
          <p>{t("No quizzes available yet.")}</p>
        </div>
      ) : (
        <div className="qp-quiz-grid">
          {quizzes.map((quiz, idx) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              index={idx}
              onSelect={handleQuizSelect}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, index, onSelect, t }) {
  const CATEGORY_MAP = {
    pest_disease: { label: t("Pest & Disease"), icon: "🐛" },
    farming_practices: { label: t("Farming Practices"), icon: "🌾" },
    market_knowledge: { label: t("Market Knowledge"), icon: "💹" },
    govt_schemes: { label: t("Govt Schemes"), icon: "📋" },
  };

  const cat = CATEGORY_MAP[quiz.category] || {
    label: quiz.category,
    icon: "📝",
  };
  const statusColor = quiz.passed
    ? "#16a34a"
    : quiz.unlocked
      ? "#2a9d8f"
      : "#cbd5e1";

  return (
    <button
      className={`qp-card ${!quiz.unlocked ? "qp-card-locked" : ""}`}
      onClick={() => onSelect(quiz)}
      disabled={!quiz.unlocked}
    >
      <div className="qp-card-top">
        <div className="qp-card-status" style={{ borderColor: statusColor }}>
          <span style={{ color: statusColor }}>
            {quiz.passed ? "✓" : quiz.unlocked ? "▶" : "🔒"}
          </span>
        </div>
        <div className="qp-card-number">{index + 1}</div>
      </div>
      <div className="qp-card-body">
        <div className="qp-card-category">
          <span>{cat.icon}</span> <span>{cat.label}</span>
        </div>
        <h3 className="qp-card-title">{quiz.title}</h3>
        <p className="qp-card-desc">{quiz.description}</p>
        <div className="qp-card-meta">
          <div className="qp-meta-item">
            <span>❓</span> {quiz.questionCount} {t("questions")}
          </div>
          <div className="qp-meta-item">
            <span>⭐</span> 50 {t("pts")}
          </div>
        </div>
        {quiz.passed && <div className="qp-passed-badge">{t("Completed")}</div>}
      </div>
    </button>
  );
}
