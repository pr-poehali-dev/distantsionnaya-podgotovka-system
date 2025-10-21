import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const userStats = {
    coursesCompleted: 12,
    coursesInProgress: 5,
    totalCourses: 24,
    averageScore: 87,
    studyHours: 142,
    certificates: 8,
  };

  const courses = [
    {
      id: 1,
      title: 'Основы программирования',
      category: 'Разработка',
      progress: 75,
      lessons: 24,
      completedLessons: 18,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    },
    {
      id: 2,
      title: 'Веб-дизайн для начинающих',
      category: 'Дизайн',
      progress: 45,
      lessons: 16,
      completedLessons: 7,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600',
    },
    {
      id: 3,
      title: 'Маркетинг в социальных сетях',
      category: 'Маркетинг',
      progress: 90,
      lessons: 12,
      completedLessons: 11,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },
    {
      id: 4,
      title: 'Английский язык: уровень B2',
      category: 'Языки',
      progress: 30,
      lessons: 32,
      completedLessons: 10,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
  ];

  const recentActivity = [
    { type: 'completed', title: 'Урок 18: Функции в JavaScript', time: '2 часа назад' },
    { type: 'test', title: 'Тест по HTML/CSS - 95%', time: '5 часов назад' },
    { type: 'certificate', title: 'Получен сертификат по Python', time: '1 день назад' },
    { type: 'started', title: 'Начат курс "Веб-дизайн"', time: '2 дня назад' },
  ];

  const achievements = [
    { icon: 'Trophy', title: 'Первый курс', desc: 'Завершен первый курс' },
    { icon: 'Target', title: 'Цель месяца', desc: '100 часов обучения' },
    { icon: 'Award', title: 'Отличник', desc: '10 курсов с оценкой 90+' },
    { icon: 'Zap', title: 'Молния', desc: '7 дней подряд обучения' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: 'Home' },
    { id: 'courses', label: 'Курсы', icon: 'BookOpen' },
    { id: 'progress', label: 'Прогресс', icon: 'TrendingUp' },
    { id: 'library', label: 'Библиотека', icon: 'Library' },
    { id: 'tests', label: 'Тесты', icon: 'ClipboardCheck' },
    { id: 'certificates', label: 'Сертификаты', icon: 'Award' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={20} />
              </Button>
              <div className="w-9 h-9 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Icon name="User" className="text-white" size={18} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(item.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon name={item.icon as any} size={18} />
              {item.label}
            </Button>
          ))}
        </div>

        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Добро пожаловать!
              </h1>
              <p className="text-muted-foreground text-lg">
                Продолжайте свой путь к знаниям
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow animate-slide-up">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Пройдено курсов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-indigo-600">
                      {userStats.coursesCompleted}
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Icon name="BookCheck" className="text-indigo-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Средний балл
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-600">
                      {userStats.averageScore}%
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon name="Star" className="text-purple-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Часов обучения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-pink-600">
                      {userStats.studyHours}
                    </div>
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Icon name="Clock" className="text-pink-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Сертификаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-amber-600">
                      {userStats.certificates}
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Icon name="Award" className="text-amber-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} />
                    Активные курсы
                  </CardTitle>
                  <CardDescription>Продолжите обучение</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course, index) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                        <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center`}>
                          <Icon name="BookOpen" className="text-white" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Уроков: {course.completedLessons} из {course.lessons}</span>
                          <span className="font-semibold text-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <Button className="w-full mt-3" variant="outline">
                        Продолжить обучение
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Activity" size={24} />
                      Недавняя активность
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'completed' ? 'bg-green-100' :
                          activity.type === 'test' ? 'bg-blue-100' :
                          activity.type === 'certificate' ? 'bg-amber-100' :
                          'bg-purple-100'
                        }`}>
                          <Icon 
                            name={
                              activity.type === 'completed' ? 'CheckCircle2' :
                              activity.type === 'test' ? 'ClipboardCheck' :
                              activity.type === 'certificate' ? 'Award' :
                              'Play'
                            } 
                            className={
                              activity.type === 'completed' ? 'text-green-600' :
                              activity.type === 'test' ? 'text-blue-600' :
                              activity.type === 'certificate' ? 'text-amber-600' :
                              'text-purple-600'
                            }
                            size={16} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Trophy" size={24} />
                      Достижения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2">
                            <Icon name={achievement.icon as any} className="text-amber-600" size={20} />
                          </div>
                          <p className="font-semibold text-xs">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'courses' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Каталог курсов</h2>
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">Все курсы</TabsTrigger>
                <TabsTrigger value="inProgress">В процессе</TabsTrigger>
                <TabsTrigger value="completed">Завершенные</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <Card key={course.id} className="hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className={`h-32 ${course.color} rounded-t-xl flex items-center justify-center`}>
                        <Icon name="BookOpen" className="text-white" size={48} />
                      </div>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{course.completedLessons} / {course.lessons} уроков</span>
                            <span className="font-semibold">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <Button className="w-full">
                          {course.progress === 0 ? 'Начать' : 'Продолжить'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeSection === 'progress' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold mb-6">Статистика обучения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общий прогресс</CardTitle>
                  <CardDescription>Завершено {userStats.coursesCompleted} из {userStats.totalCourses} курсов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={(userStats.coursesCompleted / userStats.totalCourses) * 100} className="h-4" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{userStats.coursesCompleted}</p>
                        <p className="text-xs text-muted-foreground">Завершено</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{userStats.coursesInProgress}</p>
                        <p className="text-xs text-muted-foreground">В процессе</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-600">{userStats.totalCourses - userStats.coursesCompleted - userStats.coursesInProgress}</p>
                        <p className="text-xs text-muted-foreground">Не начато</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Средний балл по категориям</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { category: 'Разработка', score: 92, color: 'bg-indigo-600' },
                    { category: 'Дизайн', score: 85, color: 'bg-pink-600' },
                    { category: 'Маркетинг', score: 88, color: 'bg-amber-600' },
                    { category: 'Языки', score: 79, color: 'bg-emerald-600' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-bold">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
