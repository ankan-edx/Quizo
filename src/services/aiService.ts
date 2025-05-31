import OpenAI from 'openai';
import { Question, QuestionType } from '../types';

const openai = new OpenAI({
  apiKey: 'your-api-key',
  dangerouslyAllowBrowser: true
});

export async function generateQuestions(topic: string, count: number = 1): Promise<Question[]> {
  try {
    const prompt = `Generate ${count} multiple-choice question(s) about ${topic}. 
    Include 4 options with one correct answer. 
    Also provide an explanation for the correct answer.
    Format as JSON array with properties:
    - text (question text)
    - options (array of {text, isCorrect})
    - explanation`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content;
    const parsedQuestions = JSON.parse(response || '[]');

    return parsedQuestions.map((q: any, index: number) => ({
      id: `ai-q-${Date.now()}-${index}`,
      text: q.text,
      type: QuestionType.SINGLE_SELECT,
      options: q.options.map((opt: any, optIndex: number) => ({
        id: `ai-opt-${Date.now()}-${index}-${optIndex}`,
        text: opt.text,
        isCorrect: opt.isCorrect
      })),
      points: 10,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}