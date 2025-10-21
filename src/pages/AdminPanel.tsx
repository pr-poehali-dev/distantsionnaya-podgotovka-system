import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { mockUsers, mockCourses, mockAssignments, mockCertificates } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const students = mockUsers.filter(u => u.role === 'student');
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const assignments = mockAssignments.filter(a => a.studentId === studentId);
    const completed = assignments.filter(a => a.status === 'completed').length;
    const inProgress = assignments.filter(a => a.status === 'in_progress').length;
    const avgProgress = assignments.length > 0
      ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length)
      : 0;
    
    return { total: assignments.length, completed, inProgress, avgProgress };
  };

  const getCourseStats = (courseId: string) => {
    const assignments = mockAssignments.filter(a => a.courseId === courseId);
    const students = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const avgProgress = assignments.length > 0
      ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length)
      : 0;
    
    return { students, completed, avgProgress };
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
                  EduPlatform
                </span>
                <p className="text-xs text-muted-foreground">Панель администратора</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <Icon name="User" size={20} className="mr-2" />
                Режим студента
              </Button>
              <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="ShieldCheck" className="text-white" size={18} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Управление обучением
          </h1>
          <p className="text-muted-foreground text-lg">
            Назначайте курсы, отслеживайте прогресс и выдавайте документы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="animate-scale-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего студентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-indigo-600">{students.length}</div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Icon name="Users" className="text-indigo-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Активных курсов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">{mockCourses.filter(c => c.status === 'active').length}</div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon name="BookOpen" className="text-purple-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Назначений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-pink-600">{mockAssignments.length}</div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Icon name="ClipboardList" className="text-pink-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Выдано документов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-amber-600">{mockCertificates.length}</div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Icon name="Award" className="text-amber-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">
              <Icon name="Users" size={16} className="mr-2" />
              Студенты
            </TabsTrigger>
            <TabsTrigger value="courses">
              <Icon name="BookOpen" size={16} className="mr-2" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <Icon name="ClipboardList" size={16} className="mr-2" />
              Назначения
            </TabsTrigger>
            <TabsTrigger value="certificates">
              <Icon name="Award" size={16} className="mr-2" />
              Документы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Управление студентами</CardTitle>
                    <CardDescription>Добавляйте студентов и отслеживайте их прогресс</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Добавить студента
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый студент</DialogTitle>
                        <DialogDescription>Создайте учетную запись и отправьте данные для входа</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>ФИО</Label>
                          <Input placeholder="Иванов Иван Иванович" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="ivanov@mail.ru" />
                        </div>
                        <div>
                          <Label>Пароль</Label>
                          <Input type="password" placeholder="Сгенерировать автоматически" />
                        </div>
                        <Button className="w-full">
                          <Icon name="Send" size={16} className="mr-2" />
                          Создать и отправить данные
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Курсов назначено</TableHead>
                      <TableHead>Завершено</TableHead>
                      <TableHead>Прогресс</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const stats = getStudentStats(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-muted-foreground">{student.email}</TableCell>
                          <TableCell>{stats.total}</TableCell>
                          <TableCell>{stats.completed}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-indigo-600 rounded-full"
                                  style={{ width: `${stats.avgProgress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{stats.avgProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Icon name="Eye" size={14} />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Icon name="Mail" size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Управление курсами</CardTitle>
                    <CardDescription>Создавайте и редактируйте курсы обучения</CardDescription>
                  </div>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать курс
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCourses.map((course) => {
                    const stats = getCourseStats(course.id);
                    return (
                      <div key={course.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{course.category}</Badge>
                              <Badge variant="outline">{course.duration} часов</Badge>
                              <Badge variant="outline">{course.lessonsCount} уроков</Badge>
                            </div>
                          </div>
                          <Badge className={course.status === 'active' ? 'bg-green-100 text-green-700' : ''}>
                            {course.status === 'active' ? 'Активен' : 'Черновик'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="flex gap-6 text-sm text-muted-foreground">
                            <span>Студентов: {stats.students}</span>
                            <span>Завершили: {stats.completed}</span>
                            <span>Ср. прогресс: {stats.avgProgress}%</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Icon name="Edit" size={14} className="mr-1" />
                              Редактировать
                            </Button>
                            <Button size="sm" variant="outline">
                              <Icon name="Users" size={14} className="mr-1" />
                              Назначить
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Назначение курсов</CardTitle>
                    <CardDescription>Назначайте курсы студентам и отслеживайте выполнение</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Назначить курс
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Назначить курс студенту</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Студент</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите студента" />
                            </SelectTrigger>
                            <SelectContent>
                              {students.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Курс</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите курс" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCourses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Срок выполнения</Label>
                          <Input type="date" />
                        </div>
                        <Button className="w-full">Назначить курс</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Курс</TableHead>
                      <TableHead>Назначен</TableHead>
                      <TableHead>Срок</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Прогресс</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssignments.map((assignment) => {
                      const student = mockUsers.find(u => u.id === assignment.studentId);
                      const course = mockCourses.find(c => c.id === assignment.courseId);
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{student?.name}</TableCell>
                          <TableCell>{course?.title}</TableCell>
                          <TableCell>{new Date(assignment.assignedAt).toLocaleDateString('ru')}</TableCell>
                          <TableCell>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('ru') : '—'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              assignment.status === 'completed' ? 'default' :
                              assignment.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }>
                              {assignment.status === 'completed' ? 'Завершен' :
                               assignment.status === 'in_progress' ? 'В процессе' :
                               'Назначен'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-indigo-600 rounded-full"
                                  style={{ width: `${assignment.progress}%` }}
                                />
                              </div>
                              <span className="text-sm">{assignment.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Выдача документов</CardTitle>
                <CardDescription>Генерируйте удостоверения, справки и протоколы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.filter(a => a.status === 'completed').map((assignment) => {
                    const student = mockUsers.find(u => u.id === assignment.studentId);
                    const course = mockCourses.find(c => c.id === assignment.courseId);
                    const cert = mockCertificates.find(c => c.studentId === assignment.studentId && c.courseId === assignment.courseId);
                    
                    return (
                      <div key={assignment.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">{course?.title}</p>
                            {cert && (
                              <Badge className="mt-2 bg-green-100 text-green-700">
                                Выдано: {cert.certificateNumber}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {cert ? (
                              <>
                                <Button size="sm" variant="outline">
                                  <Icon name="Download" size={14} className="mr-1" />
                                  Скачать
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Icon name="Printer" size={14} className="mr-1" />
                                  Печать
                                </Button>
                              </>
                            ) : (
                              <Button size="sm">
                                <Icon name="FileText" size={14} className="mr-1" />
                                Сформировать документ
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
