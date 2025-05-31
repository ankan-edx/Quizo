import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Question, QuestionType, Option } from '../types';
import { Plus, Trash2, Save, ArrowLeft, Wand2 } from 'lucide-react';
import { generateQuestions } from '../services/aiService';

const QuestionEditor: React.FC = () => {
  const { currentQuiz, updateQuiz, setEditorMode } = useQuiz();
  const [questions, setQuestions] = useState<Question[]>(currentQuiz.questions);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);

  const handleGenerateQuestions = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const generatedQuestions = await generateQuestions(topic, count);
      setQuestions([...questions, ...generatedQuestions]);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }
    setGenerating(false);
  };

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: '',
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false }
      ],
      points: 10
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      id: `opt-${Date.now()}`,
      text: '',
      isCorrect: false
    });
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex: number, optionId: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      opt => opt.id !== optionId
    );
    setQuestions(updatedQuestions);
  };

  const handleSave = () => {
    updateQuiz({
      ...currentQuiz,
      questions: questions
    });
    setEditorMode(false);
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Question Editor</h2>
        <div className="flex gap-3">
          <button onClick={() => setEditorMode(false)} className="btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
        <h3 className="text-lg font-semibold mb-3">AI Question Generator</h3>
        <div className="flex gap-4 mb-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., JavaScript Basics)"
            className="input-field flex-1"
          />
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            min="1"
            max="5"
            className="input-field w-24"
          />
          <button
            onClick={handleGenerateQuestions}
            disabled={generating || !topic}
            className="btn-accent"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Enter a topic and number of questions to generate AI-powered quiz questions
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={question.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  placeholder="Question text"
                  className="input-field mb-3"
                />
                <div className="flex gap-4 mb-3">
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                    className="input-field"
                  >
                    <option value={QuestionType.SINGLE_SELECT}>Single Select</option>
                    <option value={QuestionType.MULTIPLE_SELECT}>Multiple Select</option>
                    <option value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</option>
                  </select>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                    placeholder="Points"
                    className="input-field w-32"
                    min="1"
                  />
                </div>
              </div>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="btn-outline text-error-400 hover:bg-error-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                    placeholder="Option text"
                    className="input-field flex-1"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                      className="w-4 h-4"
                    />
                    Correct
                  </label>
                  <button
                    onClick={() => deleteOption(qIndex, option.id)}
                    className="btn-outline text-error-400 hover:bg-error-500/10 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIndex)}
                className="btn-outline w-full mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addNewQuestion}
        className="btn-primary w-full mt-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Question
      </button>
    </div>
  );
};

export default QuestionEditor;