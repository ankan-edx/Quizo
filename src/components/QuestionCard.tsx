import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuestionType, PlayerAnswer, Option } from '../types';
import classNames from 'classnames';
import { CheckCircle, XCircle } from 'lucide-react';

const QuestionCard: React.FC = () => {
  const { 
    currentQuestion, 
    currentQuestionIndex,
    currentQuiz,
    submitAnswer, 
    goToNextQuestion,
    goToPreviousQuestion,
    completeQuiz,
    playerAnswers
  } = useQuiz();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  // Find existing answer when navigating between questions
  useEffect(() => {
    if (!currentQuestion) return;
    
    const existingAnswer = playerAnswers.find(
      answer => answer.questionId === currentQuestion.id
    );
    
    if (existingAnswer) {
      setSelectedOptions(existingAnswer.selectedOptionIds);
      setTextAnswer(existingAnswer.textAnswer || '');
      setSubmitted(true);
    } else {
      setSelectedOptions([]);
      setTextAnswer('');
      setSubmitted(false);
    }
    
    setFeedback('');
  }, [currentQuestion, playerAnswers]);

  if (!currentQuestion) return null;

  const handleOptionSelect = (optionId: string) => {
    if (submitted) return;
    
    if (currentQuestion.type === QuestionType.SINGLE_SELECT) {
      setSelectedOptions([optionId]);
    } else if (currentQuestion.type === QuestionType.MULTIPLE_SELECT) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleTextAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitted) return;
    setTextAnswer(e.target.value);
  };

  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;

  const handleSubmit = () => {
    if (submitted) {
      // Already submitted, move to next question or complete quiz
      if (isLastQuestion) {
        completeQuiz();
      } else {
        goToNextQuestion();
      }
      return;
    }
    
    if (currentQuestion.type === QuestionType.FILL_IN_BLANK && textAnswer.trim() === '') {
      setFeedback('Please enter your answer');
      return;
    }
    
    if ((currentQuestion.type === QuestionType.SINGLE_SELECT || 
         currentQuestion.type === QuestionType.MULTIPLE_SELECT) && 
        selectedOptions.length === 0) {
      setFeedback('Please select an answer');
      return;
    }
    
    // For multiple select, validate at least one option is selected
    if (currentQuestion.type === QuestionType.MULTIPLE_SELECT && 
        currentQuestion.options.some(opt => opt.isCorrect) && 
        selectedOptions.length === 0) {
      setFeedback('Please select at least one answer');
      return;
    }

    // Determine if answer is correct
    let isCorrect = false;
    
    if (currentQuestion.type === QuestionType.FILL_IN_BLANK) {
      // Normalize text answer (lowercase, trim)
      const normalizedAnswer = textAnswer.trim().toLowerCase();
      isCorrect = currentQuestion.options.some(opt => 
        opt.text.toLowerCase() === normalizedAnswer
      );
    } else {
      // For single/multiple select
      const correctOptionIds = currentQuestion.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);
      
      // For single select, check if the selected option is correct
      if (currentQuestion.type === QuestionType.SINGLE_SELECT) {
        isCorrect = correctOptionIds.includes(selectedOptions[0]);
      } else {
        // For multiple select, check if all correct options are selected and no incorrect ones
        const allCorrectOptionsSelected = correctOptionIds.every(id => 
          selectedOptions.includes(id)
        );
        
        const noIncorrectOptionsSelected = selectedOptions.every(id => 
          correctOptionIds.includes(id)
        );
        
        isCorrect = allCorrectOptionsSelected && noIncorrectOptionsSelected;
      }
    }
    
    // Create the answer object
    const answer: PlayerAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIds: selectedOptions,
      textAnswer: currentQuestion.type === QuestionType.FILL_IN_BLANK ? textAnswer : undefined,
      isCorrect,
      points: isCorrect ? currentQuestion.points : 0
    };
    
    // Submit the answer
    submitAnswer(answer);
    setSubmitted(true);
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect');
  };

  const isOptionCorrect = (option: Option): boolean => {
    return submitted && option.isCorrect;
  };
  
  const isOptionIncorrect = (option: Option): boolean => {
    return submitted && selectedOptions.includes(option.id) && !option.isCorrect;
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case QuestionType.SINGLE_SELECT:
      case QuestionType.MULTIPLE_SELECT:
        return (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map(option => (
              <div
                key={option.id}
                className={classNames('quiz-option', {
                  'selected': selectedOptions.includes(option.id),
                  'correct': isOptionCorrect(option),
                  'incorrect': isOptionIncorrect(option)
                })}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-center">
                  {currentQuestion.type === QuestionType.SINGLE_SELECT ? (
                    <div className={classNames(
                      'w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0',
                      {
                        'border-white/50': !selectedOptions.includes(option.id) && !submitted,
                        'border-primary-500 bg-primary-500': selectedOptions.includes(option.id) && !submitted,
                        'border-success-500 bg-success-500': isOptionCorrect(option),
                        'border-error-500 bg-error-500': isOptionIncorrect(option)
                      }
                    )}></div>
                  ) : (
                    <div className={classNames(
                      'w-5 h-5 rounded border-2 mr-3 flex-shrink-0',
                      {
                        'border-white/50': !selectedOptions.includes(option.id) && !submitted,
                        'border-primary-500 bg-primary-500': selectedOptions.includes(option.id) && !submitted,
                        'border-success-500 bg-success-500': isOptionCorrect(option),
                        'border-error-500 bg-error-500': isOptionIncorrect(option)
                      }
                    )}>
                      {selectedOptions.includes(option.id) && (
                        <div className="flex items-center justify-center h-full">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  <span>{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case QuestionType.FILL_IN_BLANK:
        return (
          <div className="mb-6">
            <input
              type="text"
              value={textAnswer}
              onChange={handleTextAnswerChange}
              placeholder="Type your answer here"
              className={classNames('input-field', {
                'border-success-500': submitted && feedback === 'Correct!',
                'border-error-500': submitted && feedback === 'Incorrect'
              })}
              disabled={submitted}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-300">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </span>
          <span className="text-sm font-medium text-gray-300">
            {currentQuestion.points} points
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
        
        {currentQuestion.type === QuestionType.MULTIPLE_SELECT && (
          <p className="text-sm text-gray-300 mb-3">
            Select all that apply
          </p>
        )}
        
        {renderQuestionContent()}
        
        {submitted && currentQuestion.explanation && (
          <div className={classNames('p-4 rounded-lg mt-4', {
            'bg-success-500/10 border border-success-500/30': feedback === 'Correct!',
            'bg-error-500/10 border border-error-500/30': feedback === 'Incorrect'
          })}>
            <div className="flex items-start mb-2">
              {feedback === 'Correct!' ? (
                <CheckCircle className="w-5 h-5 text-success-500 mr-2 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-error-500 mr-2 mt-0.5" />
              )}
              <span className="font-medium">{feedback}</span>
            </div>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
        
        {feedback && !submitted && (
          <p className="text-error-400 text-sm mt-2">{feedback}</p>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={goToPreviousQuestion}
          className="btn-outline"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <button
          onClick={handleSubmit}
          className={classNames({
            'btn-primary': !submitted,
            'btn-accent': submitted
          })}
        >
          {submitted 
            ? (isLastQuestion ? 'Finish Quiz' : 'Next Question') 
            : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;