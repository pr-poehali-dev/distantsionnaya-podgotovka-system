import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { mockUsers, mockCourses, mockAssignments, mockTestQuestions, mockMaterials, mockCertificates, getCurrentUser } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { CourseMaterial } from '@/data/mockData';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<'adaptive' | 'full' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewedMaterials, setViewedMaterials] = useState<Set<string>>(new Set());
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showErrorAnalysis, setShowErrorAnalysis] = useState<'questions' | 'documents' | null>(null);

  if (!currentUser) return null;

  const myAssignments = mockAssignments.filter(a => a.studentId === currentUser.id);
  const myCourses = myAssignments.map(assignment => {
    const course = mockCourses.find(c => c.id === assignment.courseId);
    return { ...course, assignment };
  }).filter(c => c.id);

  const selectedCourseData = myCourses.find(c => c.id === selectedCourse);
  const courseQuestions = mockTestQuestions.filter(q => q.courseId === selectedCourse);
  const courseMaterials = mockMaterials.filter(m => m.courseId === selectedCourse);
  const myCertificates = mockCertificates.filter(c => c.studentId === currentUser.id);

  const filteredQuestions = courseQuestions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.options.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStartTest = (mode: 'adaptive' | 'full') => {
    setTestMode(mode);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmitAnswer = () => {
    if (testMode === 'adaptive') {
      const question = courseQuestions[currentQuestion];
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer !== undefined) {
        setIsAnswerCorrect(selectedAnswer === question.correctAnswer);
        setShowAnswerFeedback(true);
      }
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    setShowAnswerFeedback(false);
    if (currentQuestion < courseQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    courseQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / courseQuestions.length) * 100);
  };

  const getWrongAnswers = () => {
    return courseQuestions.filter(q => selectedAnswers[q.id] !== q.correctAnswer);
  };

  const getUniqueDocumentsFromErrors = () => {
    const wrongAnswers = getWrongAnswers();
    const documentsMap = new Map();
    
    wrongAnswers.forEach(q => {
      if (q.regulatoryDocument && q.documentClause) {
        const key = `${q.regulatoryDocument}|${q.documentClause}`;
        if (!documentsMap.has(key)) {
          documentsMap.set(key, {
            document: q.regulatoryDocument,
            clause: q.documentClause,
            text: q.clauseText,
            questions: []
          });
        }
        documentsMap.get(key).questions.push(q.question);
      }
    });
    
    return Array.from(documentsMap.values());
  };

  const handleMaterialOpen = (material: CourseMaterial) => {
    setSelectedMaterial(material);
    setTimeout(() => {
      setViewedMaterials(prev => new Set([...prev, material.id]));
    }, 3000);
  };

  const handleMaterialClose = () => {
    setSelectedMaterial(null);
    setIsFullscreen(false);
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return 'Play';
      case 'presentation': return 'FileText';
      case 'document': return 'FileText';
      default: return 'File';
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const viewer = document.getElementById('material-viewer');
    if (!viewer) return;

    if (!document.fullscreenElement) {
      viewer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ИСП
                </span>
                <p className="text-xs text-muted-foreground">{currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="sm" title="Техподдержка">
                <Icon name="Headphones" size={20} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
              </Button>
              <div className="w-9 h-9 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Icon name="User" className="text-white" size={18} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Мои курсы
              </h1>
              <p className="text-muted-foreground text-lg">
                Назначенные вам программы обучения
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="animate-scale-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Всего курсов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600">{myAssignments.length}</div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Завершено
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {myAssignments.filter(a => a.status === 'completed').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Сертификаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{myCertificates.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCourses.map((course: any) => (
                <Card key={course.id} className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course.id)}>
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl flex items-center justify-center">
                    <Icon name="BookOpen" className="text-white" size={48} />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                      <Badge variant={
                        course.assignment.status === 'completed' ? 'default' :
                        course.assignment.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }>
                        {course.assignment.status === 'completed' ? 'Завершен' :
                         course.assignment.status === 'in_progress' ? 'В процессе' :
                         'Новый'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">{course.duration} часов</Badge>
                      <Badge variant="outline">{course.lessonsCount} уроков</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span className="font-semibold">{course.assignment.progress}%</span>
                      </div>
                      <Progress value={course.assignment.progress} />
                    </div>
                    {course.assignment.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Срок: {new Date(course.assignment.dueDate).toLocaleDateString('ru')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад к курсам
              </Button>
              <h1 className="text-3xl font-bold mb-2">{selectedCourseData?.title}</h1>
              <p className="text-muted-foreground">{selectedCourseData?.description}</p>
            </div>

            <Tabs defaultValue="test" className="space-y-6">
              <TabsList className="h-auto bg-transparent gap-2">
                <TabsTrigger 
                  value="test"
                  className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <Icon name="ClipboardCheck" size={24} className="mb-2" />
                  <span className="text-xs font-medium">Тестирование</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="materials"
                  className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <Icon name="FileText" size={24} className="mb-2" />
                  <span className="text-xs font-medium">Материалы</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="search"
                  className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <Icon name="Search" size={24} className="mb-2" />
                  <span className="text-xs font-medium">Поиск ответов</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="test">
                {!testMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="Zap" className="text-indigo-600" size={24} />
                        </div>
                        <CardTitle>Адаптивный тест</CardTitle>
                        <CardDescription>
                          Умная система подбирает вопросы по вашему уровню знаний. Быстрая проверка понимания материала.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={() => handleStartTest('adaptive')}>
                          <Icon name="Play" size={16} className="mr-2" />
                          Начать адаптивный тест
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="ListChecks" className="text-purple-600" size={24} />
                        </div>
                        <CardTitle>Полное тестирование</CardTitle>
                        <CardDescription>
                          Все вопросы курса по порядку. После прохождения доступен режим работы над ошибками.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={() => handleStartTest('full')}>
                          <Icon name="Play" size={16} className="mr-2" />
                          Начать полный тест
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (testMode === 'adaptive' || testMode === 'full') && !showResults ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Вопрос {currentQuestion + 1} из {courseQuestions.length}</CardTitle>
                            <CardDescription>
                              {testMode === 'adaptive' ? 'Адаптивный режим' : 'Полное тестирование'}
                            </CardDescription>
                          </div>
                          <Badge>{Math.round(((currentQuestion + 1) / courseQuestions.length) * 100)}%</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Progress value={((currentQuestion + 1) / courseQuestions.length) * 100} />
                        
                        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <p className="text-lg font-medium">{courseQuestions[currentQuestion].question}</p>
                        </div>

                        <RadioGroup
                          value={selectedAnswers[courseQuestions[currentQuestion].id]?.toString()}
                          onValueChange={(value) => handleAnswerSelect(courseQuestions[currentQuestion].id, parseInt(value))}
                          disabled={showAnswerFeedback}
                        >
                          {courseQuestions[currentQuestion].options.map((option, index) => {
                            const isSelected = selectedAnswers[courseQuestions[currentQuestion].id] === index;
                            const isCorrect = index === courseQuestions[currentQuestion].correctAnswer;
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
                                  !showAnswerFeedback ? 'hover:bg-gray-50' : ''
                                } ${
                                  showAnswerFeedback && testMode === 'adaptive' && isSelected && isCorrect ? 'bg-green-50 border-green-500' : ''
                                } ${
                                  showAnswerFeedback && testMode === 'adaptive' && isSelected && !isCorrect ? 'bg-red-50 border-red-500' : ''
                                }`}
                              >
                                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer flex items-center justify-between">
                                  <span>{option}</span>
                                  {showAnswerFeedback && testMode === 'adaptive' && isSelected && (
                                    <Icon 
                                      name={isCorrect ? 'CheckCircle2' : 'XCircle'} 
                                      className={isCorrect ? 'text-green-600' : 'text-red-600'} 
                                      size={20} 
                                    />
                                  )}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>

                        {!showAnswerFeedback && (
                          <div className="flex justify-between">
                            {testMode === 'full' && (
                              <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                              >
                                <Icon name="ChevronLeft" size={16} className="mr-2" />
                                Назад
                              </Button>
                            )}
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={selectedAnswers[courseQuestions[currentQuestion].id] === undefined}
                              className={testMode === 'adaptive' ? 'w-full' : ''}
                            >
                              {testMode === 'adaptive' ? 'Ответить' : currentQuestion === courseQuestions.length - 1 ? 'Завершить' : 'Далее'}
                              <Icon name={testMode === 'adaptive' ? 'Send' : 'ChevronRight'} size={16} className="ml-2" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {showAnswerFeedback && testMode === 'adaptive' && (
                      <Card className={`animate-scale-in ${isAnswerCorrect ? 'border-green-500' : 'border-red-500'} border-2`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isAnswerCorrect ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <Icon 
                                name={isAnswerCorrect ? 'CheckCircle2' : 'XCircle'} 
                                className={isAnswerCorrect ? 'text-green-600' : 'text-red-600'} 
                                size={28} 
                              />
                            </div>
                            <div>
                              <CardTitle className={isAnswerCorrect ? 'text-green-700' : 'text-red-700'}>
                                {isAnswerCorrect ? 'Правильно!' : 'Неправильно'}
                              </CardTitle>
                              <CardDescription>
                                {courseQuestions[currentQuestion].explanation}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {courseQuestions[currentQuestion].regulatoryDocument && (
                          <CardContent className="space-y-4">
                            <div className="border-t pt-4">
                              <div className="flex items-start gap-2 mb-3">
                                <Icon name="BookOpen" className="text-indigo-600 mt-1" size={20} />
                                <div>
                                  <p className="font-semibold text-indigo-900">
                                    {courseQuestions[currentQuestion].regulatoryDocument}
                                  </p>
                                  <p className="text-sm text-indigo-700 font-medium mt-1">
                                    {courseQuestions[currentQuestion].documentClause}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {courseQuestions[currentQuestion].clauseText}
                                </p>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              size="lg"
                              onClick={handleNextQuestion}
                            >
                              Изучил, давай дальше
                              <Icon name="ArrowRight" size={20} className="ml-2" />
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </div>
                ) : showResults ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Результаты тестирования</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {calculateScore()}%
                          </div>
                          <p className="text-muted-foreground">
                            Правильных ответов: {Object.keys(selectedAnswers).filter(k => selectedAnswers[k] === courseQuestions.find(q => q.id === k)?.correctAnswer).length} из {courseQuestions.length}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Button className="flex-1" onClick={() => { setTestMode(null); setShowErrorAnalysis(null); }}>
                            <Icon name="RotateCcw" size={16} className="mr-2" />
                            Пройти снова
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать протокол
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {getWrongAnswers().length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Icon name="AlertCircle" size={24} className="text-amber-600" />
                            Работа над ошибками
                          </CardTitle>
                          <CardDescription>Выберите режим анализа ошибок</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button 
                              variant={showErrorAnalysis === 'questions' ? 'default' : 'outline'}
                              className="h-auto py-6 flex-col gap-2"
                              onClick={() => setShowErrorAnalysis(showErrorAnalysis === 'questions' ? null : 'questions')}
                            >
                              <Icon name="HelpCircle" size={28} />
                              <span className="font-semibold">Посмотреть вопросы</span>
                              <span className="text-xs opacity-80">в которых я сделал ошибку</span>
                            </Button>
                            
                            <Button 
                              variant={showErrorAnalysis === 'documents' ? 'default' : 'outline'}
                              className="h-auto py-6 flex-col gap-2"
                              onClick={() => setShowErrorAnalysis(showErrorAnalysis === 'documents' ? null : 'documents')}
                            >
                              <Icon name="BookOpen" size={28} />
                              <span className="font-semibold">Нормативные документы</span>
                              <span className="text-xs opacity-80">которые надо изучить</span>
                            </Button>
                          </div>

                          {showErrorAnalysis === 'questions' && (
                            <div className="space-y-4 mt-6 border-t pt-6">
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icon name="XCircle" className="text-red-600" size={20} />
                                Вопросы с ошибками ({getWrongAnswers().length})
                              </h3>
                              {getWrongAnswers().map((question, index) => (
                                <div key={question.id} className="p-4 border rounded-lg space-y-3 bg-red-50/50">
                                  <p className="font-medium">Вопрос {index + 1}: {question.question}</p>
                                  <div className="space-y-2">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                      <Icon name="X" size={16} />
                                      <span>Ваш ответ: {question.options[selectedAnswers[question.id]]}</span>
                                    </p>
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                      <Icon name="Check" size={16} />
                                      <span>Правильный ответ: {question.options[question.correctAnswer]}</span>
                                    </p>
                                    {question.explanation && (
                                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                                        💡 {question.explanation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {showErrorAnalysis === 'documents' && (
                            <div className="space-y-4 mt-6 border-t pt-6">
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icon name="BookMarked" className="text-indigo-600" size={20} />
                                Нормативные документы для изучения ({getUniqueDocumentsFromErrors().length})
                              </h3>
                              {getUniqueDocumentsFromErrors().map((doc, index) => (
                                <div key={index} className="p-5 border rounded-lg space-y-3 bg-indigo-50/50">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Icon name="FileText" className="text-indigo-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-indigo-900 mb-1">
                                        {doc.document}
                                      </p>
                                      <p className="text-sm text-indigo-700 font-medium mb-3">
                                        {doc.clause}
                                      </p>
                                      <div className="bg-white p-4 rounded border border-indigo-200">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                          {doc.text}
                                        </p>
                                      </div>
                                      <div className="mt-3">
                                        <p className="text-xs text-muted-foreground mb-2">Связанные вопросы:</p>
                                        <ul className="text-xs space-y-1">
                                          {doc.questions.map((q: string, i: number) => (
                                            <li key={i} className="text-gray-600">• {q}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="materials">
                <Card>
                  <CardHeader>
                    <CardTitle>Учебные материалы</CardTitle>
                    <CardDescription>Презентации, видео и нормативные документы</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {courseMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Icon
                              name={getMaterialIcon(material.type)}
                              className="text-indigo-600"
                              size={20}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{material.title}</p>
                              {viewedMaterials.has(material.id) && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <Icon name="Check" size={12} className="mr-1" />
                                  Просмотрено
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {material.type === 'video' ? 'Видео' : material.type === 'presentation' ? 'Презентация' : 'Документ'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleMaterialOpen(material)}>
                            <Icon name="Eye" size={14} className="mr-1" />
                            Открыть
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Download" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="search">
                <Card>
                  <CardHeader>
                    <CardTitle>Быстрый поиск ответов</CardTitle>
                    <CardDescription>Найдите правильный ответ на любой вопрос курса</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Введите ключевые слова из вопроса..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {searchQuery && (
                      <div className="space-y-3">
                        {filteredQuestions.length > 0 ? (
                          filteredQuestions.map((question) => (
                            <div key={question.id} className="p-4 border rounded-lg space-y-3">
                              <p className="font-medium">{question.question}</p>
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 rounded ${
                                      index === question.correctAnswer
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-gray-50'
                                    }`}
                                  >
                                    {index === question.correctAnswer && '✅ '}
                                    {option}
                                  </div>
                                ))}
                              </div>
                              {question.explanation && (
                                <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                                  💡 {question.explanation}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            Вопросы не найдены. Попробуйте другой запрос.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <Dialog open={!!selectedMaterial} onOpenChange={() => handleMaterialClose()}>
        <DialogContent className="max-w-6xl h-[90vh] p-0" id="material-viewer">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{selectedMaterial?.title}</DialogTitle>
                  <DialogDescription className="capitalize">
                    {selectedMaterial?.type === 'video' ? 'Видео' : selectedMaterial?.type === 'presentation' ? 'Презентация' : 'Документ'}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={toggleFullscreen}>
                    <Icon name={isFullscreen ? 'Minimize' : 'Maximize'} size={16} className="mr-2" />
                    {isFullscreen ? 'Выход' : 'Полный экран'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden bg-gray-50">
              {selectedMaterial?.type === 'video' && (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <video 
                    controls 
                    className="w-full h-full rounded-lg shadow-lg bg-black"
                    src={selectedMaterial.url}
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                </div>
              )}
              
              {(selectedMaterial?.type === 'presentation' || selectedMaterial?.type === 'document') && (
                <div className="w-full h-full p-6">
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedMaterial.url)}&embedded=true`}
                    className="w-full h-full rounded-lg shadow-lg bg-white"
                    title={selectedMaterial.title}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;