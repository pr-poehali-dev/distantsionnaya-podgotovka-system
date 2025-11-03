import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface ExamModeProps {
  questions: Question[];
  studentName: string;
  courseName: string;
  onExit: () => void;
}

export const ExamMode = ({ questions, studentName, courseName, onExit }: ExamModeProps) => {
  const [examQuestions] = useState(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answerIndex });
  };

  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const getUnansweredQuestions = () => {
    return examQuestions.map((_, idx) => idx).filter(idx => selectedAnswers[idx] === undefined);
  };

  const handleFinishClick = () => {
    const unanswered = getUnansweredQuestions();
    if (unanswered.length > 0) {
      setShowUnansweredWarning(true);
    } else {
      setShowConfirmFinish(true);
    }
  };

  const handleAutoFinish = () => {
    finishExam();
  };

  const finishExam = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    let correctCount = 0;

    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setIsFinished(true);
    setShowConfirmFinish(false);
    setShowUnansweredWarning(false);
  };

  const calculateResults = () => {
    let correctCount = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: examQuestions.length,
      passed: correctCount >= 18,
      timeSpent: Math.floor((Date.now() - startTime) / 1000)
    };
  };

  if (isFinished) {
    const results = calculateResults();
    const mins = Math.floor(results.timeSpent / 60);
    const secs = results.timeSpent % 60;

    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className={`${results.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Протокол экзамена</CardTitle>
              <Badge variant={results.passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {results.passed ? '✓ Сдал успешно' : '✗ Экзамен не сдан'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ФИО</p>
                <p className="font-semibold">{studentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Курс</p>
                <p className="font-semibold">{courseName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Результат</p>
                <p className="font-semibold text-lg">{results.correct} из {results.total} вопросов</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Затрачено времени</p>
                <p className="font-semibold">{mins} мин {secs} сек</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Детализация по вопросам:</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {examQuestions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div key={idx} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start gap-3">
                        <Badge variant={isCorrect ? "default" : "destructive"}>{idx + 1}</Badge>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{q.question}</p>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">Ваш ответ: </span>
                              <span className={!isCorrect ? 'text-red-600 font-medium' : ''}>
                                {userAnswer !== undefined ? q.options[userAnswer] : 'Не отвечено'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="text-muted-foreground">Правильный ответ: </span>
                                <span className="text-green-600 font-medium">{q.options[q.correctAnswer]}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={onExit} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" className="mr-2" size={18} />
                К курсам
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                <Icon name="RefreshCw" className="mr-2" size={18} />
                Пройти заново
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const unanswered = getUnansweredQuestions();

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Экзамен</CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant={timeLeft < 300 ? "destructive" : "default"} className="text-lg px-4 py-2">
                  <Icon name="Clock" size={18} className="mr-2" />
                  {formatTime(timeLeft)}
                </Badge>
                <Button onClick={handleFinishClick} variant="outline">
                  Завершить тест
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Навигация по вопросам:</p>
              <div className="flex flex-wrap gap-2">
                {examQuestions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuestionNavigate(idx)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        isCurrent 
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' 
                          : isAnswered 
                            ? 'bg-gray-400 text-white hover:bg-gray-500' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Отвечено</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Не отвечено</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  <span>Текущий</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Badge variant="outline" className="mt-1">{currentQuestionIndex + 1} / {examQuestions.length}</Badge>
                <h3 className="text-lg font-medium leading-relaxed">{currentQuestion.question}</h3>
              </div>

              <RadioGroup 
                value={selectedAnswers[currentQuestionIndex]?.toString() || ''} 
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleQuestionNavigate(currentQuestionIndex - 1)}
                >
                  <Icon name="ChevronLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              )}
              {currentQuestionIndex < examQuestions.length - 1 && (
                <Button
                  onClick={() => handleQuestionNavigate(currentQuestionIndex + 1)}
                  className="ml-auto"
                >
                  Далее
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmFinish} onOpenChange={setShowConfirmFinish}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Завершить тест?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Вы уверены, что хотите завершить тест? После завершения вы не сможете изменить ответы.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmFinish(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={finishExam} className="flex-1">
              Завершить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnansweredWarning} onOpenChange={setShowUnansweredWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Есть неотвеченные вопросы</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-4">
            У вас остались вопросы, на которые вы не дали ответ: <strong>{unanswered.length} шт.</strong>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {unanswered.map(idx => (
              <Badge key={idx} variant="destructive">{idx + 1}</Badge>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowUnansweredWarning(false)} className="flex-1">
              Вернуться к тесту
            </Button>
            <Button onClick={finishExam} variant="destructive" className="flex-1">
              Завершить всё равно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExamMode;
