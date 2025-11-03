import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  regulatoryDocument?: string;
  documentClause?: string;
  clauseText?: string;
}

interface AdaptiveTestModeProps {
  questions: Question[];
  studentId: string;
  courseId: string;
  onExit: () => void;
}

export const AdaptiveTestMode = ({ questions, studentId, courseId, onExit }: AdaptiveTestModeProps) => {
  const [activeQuestions, setActiveQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeTest();
  }, []);

  const initializeTest = async () => {
    try {
      const allQuestionIds = questions.map(q => q.id);
      
      const response = await fetch('https://functions.poehali.dev/864d635a-59f0-455f-9cfd-a169f79727be', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'init',
          studentId,
          courseId,
          allQuestionIds
        })
      });

      const data = await response.json();
      
      const progressResponse = await fetch(
        `https://functions.poehali.dev/864d635a-59f0-455f-9cfd-a169f79727be?studentId=${studentId}&courseId=${courseId}`
      );
      const progressData = await progressResponse.json();
      
      const activeSet = progressData.progress
        .filter((p: any) => p.isInActiveSet)
        .map((p: any) => p.questionId);
      
      const mastered = progressData.progress.filter((p: any) => p.isMastered).length;
      
      setActiveQuestions(activeSet);
      setMasteredCount(mastered);
      
      if (activeSet.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeSet.length);
        const q = questions.find(qu => qu.id === activeSet[randomIndex]);
        if (q) setCurrentQuestion(q);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize test:', error);
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === undefined || !currentQuestion) return;

    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    try {
      const allQuestionIds = questions.map(q => q.id);
      
      const response = await fetch('https://functions.poehali.dev/864d635a-59f0-455f-9cfd-a169f79727be', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          studentId,
          courseId,
          questionId: currentQuestion.id,
          isCorrect: isAnswerCorrect,
          allQuestionIds
        })
      });

      const data = await response.json();
      
      if (data.mastered) {
        setMasteredCount(prev => prev + 1);
        setActiveQuestions(data.activeSet || []);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(undefined);
    
    if (activeQuestions.length === 0) {
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * activeQuestions.length);
    const q = questions.find(qu => qu.id === activeQuestions[randomIndex]);
    if (q) setCurrentQuestion(q);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Icon name="Loader2" className="animate-spin" size={32} />
        </CardContent>
      </Card>
    );
  }

  if (masteredCount === questions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">🎉 Поздравляем!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg">Вы изучили все вопросы курса!</p>
          <p className="text-muted-foreground">
            Все {questions.length} вопросов были правильно отвечены по 3 раза подряд.
          </p>
          <Button onClick={onExit} className="mt-4">
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Вернуться к курсу
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Не удалось загрузить вопрос</p>
          <Button onClick={onExit} className="mt-4" variant="outline">
            Вернуться
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = (masteredCount / questions.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <CardTitle>Адаптивный тест</CardTitle>
            <Badge variant="secondary">
              Изучено: {masteredCount} / {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Активных вопросов: {activeQuestions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>
          </div>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showFeedback}
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-all ${
                    !showFeedback ? 'hover:bg-gray-50' : ''
                  } ${
                    showFeedback && isSelected && isCorrectAnswer ? 'bg-green-50 border-green-500' : ''
                  } ${
                    showFeedback && isSelected && !isCorrectAnswer ? 'bg-red-50 border-red-500' : ''
                  } ${
                    showFeedback && !isSelected && isCorrectAnswer ? 'bg-green-50 border-green-300' : ''
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showFeedback && isCorrectAnswer && (
                    <Icon name="CheckCircle2" className="text-green-600" size={20} />
                  )}
                  {showFeedback && isSelected && !isCorrectAnswer && (
                    <Icon name="XCircle" className="text-red-600" size={20} />
                  )}
                </div>
              );
            })}
          </RadioGroup>

          {!showFeedback && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === undefined}
              className="w-full"
            >
              Ответить
              <Icon name="Send" size={16} className="ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>

      {showFeedback && (
        <Card className={`animate-scale-in ${isCorrect ? 'border-green-500' : 'border-red-500'} border-2`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Icon
                  name={isCorrect ? 'CheckCircle2' : 'XCircle'}
                  className={isCorrect ? 'text-green-600' : 'text-red-600'}
                  size={28}
                />
              </div>
              <div>
                <CardTitle className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {isCorrect ? 'Правильно!' : 'Неправильно'}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentQuestion.regulatoryDocument && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <Icon name="FileText" className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900">{currentQuestion.regulatoryDocument}</p>
                    <p className="text-sm text-blue-700">Пункт {currentQuestion.documentClause}</p>
                  </div>
                </div>
                {currentQuestion.clauseText && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentQuestion.clauseText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleNextQuestion}
            >
              Изучил, давай дальше
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdaptiveTestMode;
