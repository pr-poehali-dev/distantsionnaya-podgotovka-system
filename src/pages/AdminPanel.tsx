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
import { Textarea } from '@/components/ui/textarea';
import { mockUsers, mockCourses, mockAssignments, mockCertificates, mockOrganizations, mockTrainingRequests } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { generateExcelTemplate } from '@/utils/excelTemplate';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [copiedLogin, setCopiedLogin] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    inn: '',
    address: '',
    director: '',
    contractDate: '',
    contractNumber: ''
  });

  const students = mockUsers.filter(u => u.role === 'student');
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = s.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesOrg = s.organization?.toLowerCase().includes(organizationFilter.toLowerCase());
    const matchesGroup = s.group?.toLowerCase().includes(groupFilter.toLowerCase());
    
    return matchesSearch && matchesName && matchesOrg && matchesGroup;
  });

  const copyToClipboard = (text: string, studentId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogin(studentId);
    setTimeout(() => setCopiedLogin(null), 2000);
  };

  const getStudentStats = (studentId: string) => {
    const assignments = mockAssignments.filter(a => a.studentId === studentId);
    const completed = assignments.filter(a => a.status === 'completed').length;
    const inProgress = assignments.filter(a => a.status === 'in_progress').length;
    const avgProgress = assignments.length > 0
      ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length)
      : 0;
    
    return { total: assignments.length, completed, inProgress, avgProgress };
  };

  const getStudentAssignments = (studentId: string) => {
    return mockAssignments.filter(a => a.studentId === studentId).map(assignment => {
      const course = mockCourses.find(c => c.id === assignment.courseId);
      return { ...assignment, course };
    });
  };

  const totalSubscriptions = 100;
  const usedSubscriptions = mockAssignments.reduce((sum, a) => sum + a.subscriptionsUsed, 0);
  const remainingSubscriptions = totalSubscriptions - usedSubscriptions;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const usedThisMonth = mockAssignments.filter(a => {
    if (!a.activatedAt) return false;
    const activatedDate = new Date(a.activatedAt);
    return activatedDate.getMonth() === currentMonth && activatedDate.getFullYear() === currentYear;
  }).reduce((sum, a) => sum + a.subscriptionsUsed, 0);

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
                  ИСП
                </span>
                <p className="text-xs text-muted-foreground">Интеллектуальная система подготовки</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" title="Техподдержка">
                <Icon name="Headphones" size={20} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
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
          <Card className="animate-scale-in cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/subscriptions')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего подписок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-indigo-600">{totalSubscriptions}</div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Icon name="Package" className="text-indigo-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in cursor-pointer hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }} onClick={() => navigate('/subscriptions')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Осталось подписок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">{remainingSubscriptions}</div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle2" className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in cursor-pointer hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }} onClick={() => navigate('/subscriptions')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Списано в текущем месяце
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">{usedThisMonth}</div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingDown" className="text-orange-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Подписки
                <Button size="sm" variant="outline" onClick={() => navigate('/subscriptions')}>
                  <Icon name="BarChart3" size={14} className="mr-1" />
                  Статистика
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Использовано</span>
                  <span className="font-semibold">{usedSubscriptions}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                    style={{ width: `${(usedSubscriptions / totalSubscriptions) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="h-auto bg-transparent gap-2">
            <TabsTrigger 
              value="requests" 
              className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Icon name="Inbox" size={24} className="mb-2" />
              <span className="text-xs font-medium">Заявки от организаций</span>
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Icon name="Users" size={24} className="mb-2" />
              <span className="text-xs font-medium">Студенты</span>
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Icon name="BookOpen" size={24} className="mb-2" />
              <span className="text-xs font-medium">Курсы</span>
            </TabsTrigger>
            <TabsTrigger 
              value="certificates"
              className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Icon name="Award" size={24} className="mb-2" />
              <span className="text-xs font-medium">Документы</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex-col h-auto py-4 px-6 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Icon name="Settings" size={24} className="mb-2" />
              <span className="text-xs font-medium">Настройки организации</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Заявки на обучение</CardTitle>
                    <CardDescription>Обработка заявок от организаций на групповое обучение</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Новая заявка
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Создать заявку на обучение</DialogTitle>
                        <DialogDescription>Загрузите Excel-файл с данными слушателей или заполните форму вручную</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label>Организация</Label>
                          <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите организацию" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">
                                <div className="flex items-center gap-2">
                                  <Icon name="Plus" size={16} className="text-indigo-600" />
                                  <span className="font-medium text-indigo-600">Новая организация</span>
                                </div>
                              </SelectItem>
                              {mockOrganizations.map(org => (
                                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedOrganization === 'new' && (
                          <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Building2" size={18} className="text-indigo-600" />
                              <h4 className="font-semibold text-indigo-900">Данные новой организации</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <Label className="text-sm">Название организации *</Label>
                                <Input
                                  placeholder="ООО 'Название'"
                                  value={newOrgData.name}
                                  onChange={(e) => setNewOrgData({...newOrgData, name: e.target.value})}
                                />
                              </div>
                              
                              <div>
                                <Label className="text-sm">ИНН *</Label>
                                <Input
                                  placeholder="7701234567"
                                  value={newOrgData.inn}
                                  onChange={(e) => setNewOrgData({...newOrgData, inn: e.target.value})}
                                  maxLength={12}
                                />
                              </div>
                              
                              <div>
                                <Label className="text-sm">ФИО руководителя *</Label>
                                <Input
                                  placeholder="Иванов Иван Иванович"
                                  value={newOrgData.director}
                                  onChange={(e) => setNewOrgData({...newOrgData, director: e.target.value})}
                                />
                              </div>
                              
                              <div className="col-span-2">
                                <Label className="text-sm">Адрес</Label>
                                <Input
                                  placeholder="г. Москва, ул. Примерная, д. 1"
                                  value={newOrgData.address}
                                  onChange={(e) => setNewOrgData({...newOrgData, address: e.target.value})}
                                />
                              </div>

                              <div className="col-span-2 border-t border-indigo-300 pt-3 mt-2">
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="FileText" size={16} className="text-indigo-600" />
                                  <h5 className="font-medium text-indigo-900 text-sm">Реквизиты договора</h5>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-sm">Дата договора</Label>
                                    <Input
                                      type="date"
                                      value={newOrgData.contractDate}
                                      onChange={(e) => setNewOrgData({...newOrgData, contractDate: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Номер договора</Label>
                                    <Input
                                      placeholder="123/2024"
                                      value={newOrgData.contractNumber}
                                      onChange={(e) => setNewOrgData({...newOrgData, contractNumber: e.target.value})}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Файл Excel со списком слушателей</Label>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={generateExcelTemplate}
                            >
                              <Icon name="Download" size={14} className="mr-2" />
                              Скачать шаблон
                            </Button>
                          </div>
                          
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                            <input
                              type="file"
                              accept=".xlsx,.xls"
                              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                              className="hidden"
                              id="excel-upload"
                            />
                            <label htmlFor="excel-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <Icon name="FileSpreadsheet" size={32} className="text-indigo-600" />
                                </div>
                                {uploadedFile ? (
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-green-600">
                                      <Icon name="CheckCircle2" size={16} className="inline mr-1" />
                                      {uploadedFile.name}
                                    </p>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setUploadedFile(null);
                                      }}
                                    >
                                      <Icon name="X" size={14} className="mr-1" />
                                      Удалить файл
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium">Нажмите для выбора файла</p>
                                    <p className="text-xs text-muted-foreground">или перетащите Excel-файл сюда</p>
                                    <p className="text-xs text-muted-foreground mt-2">Формат: .xlsx, .xls</p>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                              <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-blue-900 space-y-2">
                                <p className="font-medium">Формат шаблона Excel:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                  <li>Столбец A: ФИО слушателя</li>
                                  <li>Столбец B: Должность</li>
                                  <li>Столбец C: Email</li>
                                  <li>Столбцы D, E, F...: Курсы (названия курсов)</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          disabled={
                            !uploadedFile || 
                            !selectedOrganization || 
                            (selectedOrganization === 'new' && (!newOrgData.name || !newOrgData.inn || !newOrgData.director))
                          }
                        >
                          <Icon name="Upload" size={16} className="mr-2" />
                          Загрузить и создать заявку
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по названию организации..."
                      value={requestSearch}
                      onChange={(e) => setRequestSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active" title="Активные заявки">
                      <Icon name="Clock" size={18} className="mr-2" />
                      <Badge variant="secondary">
                        {mockTrainingRequests.filter(r => r.status !== 'completed').length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="archive" title="Архив">
                      <Icon name="Archive" size={18} className="mr-2" />
                      <Badge variant="secondary">
                        {mockTrainingRequests.filter(r => r.status === 'completed').length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-6 mt-6">
                    {mockTrainingRequests
                      .filter(r => r.status !== 'completed')
                      .filter(r => {
                        const org = mockOrganizations.find(o => o.id === r.organizationId);
                        return org?.name.toLowerCase().includes(requestSearch.toLowerCase());
                      })
                      .map((request) => {
                const org = mockOrganizations.find(o => o.id === request.organizationId);
                const allCourseIds = [...new Set(request.students.flatMap(s => s.courseIds))];
                const courses = allCourseIds.map(id => mockCourses.find(c => c.id === id)).filter(Boolean);
                const completedCount = request.students.filter(s => s.studentId).length;
                
                return (
                  <Card key={request.id} className="border-l-4" style={{
                    borderLeftColor: 
                      request.status === 'completed' ? '#10b981' :
                      request.status === 'in_progress' ? '#3b82f6' :
                      request.status === 'approved' ? '#f59e0b' :
                      '#6b7280'
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{org?.name}</CardTitle>
                            <Badge variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }>
                              {request.status === 'completed' ? 'Завершено' :
                               request.status === 'in_progress' ? 'В процессе' :
                               request.status === 'approved' ? 'Одобрено' :
                               'Новая'}
                            </Badge>
                          </div>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Icon name="BookOpen" size={14} />
                              <div className="flex flex-wrap gap-1">
                                {courses.map((course) => (
                                  <Badge key={course.id} variant="outline" className="text-xs">
                                    {course.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Calendar" size={14} />
                              <span>Заявка от {new Date(request.requestDate).toLocaleDateString('ru')}</span>
                            </div>
                            {request.completedAt && (
                              <div className="flex items-center gap-2 text-green-600">
                                <Icon name="CheckCircle2" size={14} />
                                <span>Завершено {new Date(request.completedAt).toLocaleDateString('ru')}</span>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Слушателей</div>
                          <div className="text-2xl font-bold text-indigo-600">{request.students.length}</div>
                          {request.status === 'in_progress' && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Готовы: {completedCount} из {request.students.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">Список группы</h4>
                            <Badge variant="secondary">{request.students.length} чел.</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                            >
                              <Icon name={expandedRequest === request.id ? "ChevronUp" : "ChevronDown"} size={14} className="mr-1" />
                              {expandedRequest === request.id ? "Скрыть список" : "Показать список"}
                            </Button>
                            {request.status === 'pending' && (
                              <Button size="sm">
                                <Icon name="Check" size={14} className="mr-1" />
                                Одобрить заявку
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {expandedRequest === request.id && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ФИО</TableHead>
                                <TableHead>Должность</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>СНИЛС</TableHead>
                                <TableHead>Курсы</TableHead>
                                <TableHead>Статус</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {request.students.map((student) => {
                                const studentCourses = student.courseIds.map(id => mockCourses.find(c => c.id === id)).filter(Boolean);
                                return (
                                  <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.position}</TableCell>
                                    <TableCell className="text-muted-foreground">{student.email || '—'}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {student.snils ? (
                                          <>
                                            <Icon name="CheckCircle2" size={14} className="text-green-600" />
                                            <span className="text-green-600 text-sm">Указан</span>
                                          </>
                                        ) : (
                                          <>
                                            <Icon name="AlertCircle" size={14} className="text-orange-500" />
                                            <span className="text-orange-500 text-sm">Не указан</span>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {studentCourses.map((course) => (
                                          <Badge key={course.id} variant="secondary" className="text-xs">
                                            {course.title}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {student.studentId ? (
                                        <Badge className="bg-green-100 text-green-700">Обучается</Badge>
                                      ) : (
                                        <Badge variant="outline">Не назначен</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}

                        <div className="flex gap-2 pt-4 border-t">
                          {request.status === 'completed' ? (
                            <>
                              <Button className="flex-1" variant="default">
                                <Icon name="FileText" size={16} className="mr-2" />
                                Сформировать отчет для организации
                              </Button>
                              <Button className="flex-1" variant="default">
                                <Icon name="Award" size={16} className="mr-2" />
                                Отправить все удостоверения
                              </Button>
                              <Button variant="outline">
                                <Icon name="Download" size={16} className="mr-2" />
                                Скачать архив
                              </Button>
                            </>
                          ) : request.status === 'in_progress' ? (
                            <>
                              <Button className="flex-1" variant="outline">
                                <Icon name="Eye" size={16} className="mr-2" />
                                Просмотр прогресса группы
                              </Button>
                              <Button variant="outline">
                                <Icon name="Mail" size={16} className="mr-2" />
                                Напомнить студентам
                              </Button>
                            </>
                          ) : request.status === 'approved' ? (
                            <Button className="flex-1">
                              <Icon name="UserPlus" size={16} className="mr-2" />
                              Создать аккаунты и назначить курс
                            </Button>
                          ) : null}
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">Контактное лицо:</p>
                            <p className="text-blue-700">{org?.contactPerson} — {org?.contactEmail}, {org?.contactPhone}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
                  </TabsContent>

                  <TabsContent value="archive" className="space-y-6 mt-6">
                    {mockTrainingRequests
                      .filter(r => r.status === 'completed')
                      .filter(r => {
                        const org = mockOrganizations.find(o => o.id === r.organizationId);
                        return org?.name.toLowerCase().includes(requestSearch.toLowerCase());
                      })
                      .map((request) => {
                const org = mockOrganizations.find(o => o.id === request.organizationId);
                const allCourseIds = [...new Set(request.students.flatMap(s => s.courseIds))];
                const courses = allCourseIds.map(id => mockCourses.find(c => c.id === id)).filter(Boolean);
                const completedCount = request.students.filter(s => s.studentId).length;
                
                return (
                  <Card key={request.id} className="border-l-4" style={{
                    borderLeftColor: '#10b981'
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{org?.name}</CardTitle>
                            <Badge variant="default">Завершено</Badge>
                          </div>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Icon name="BookOpen" size={14} />
                              <div className="flex flex-wrap gap-1">
                                {courses.map((course) => (
                                  <Badge key={course.id} variant="outline" className="text-xs">
                                    {course.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Calendar" size={14} />
                              <span>Заявка от {new Date(request.requestDate).toLocaleDateString('ru')}</span>
                            </div>
                            {request.completedAt && (
                              <div className="flex items-center gap-2 text-green-600">
                                <Icon name="CheckCircle2" size={14} />
                                <span>Завершено {new Date(request.completedAt).toLocaleDateString('ru')}</span>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Слушателей</div>
                          <div className="text-2xl font-bold text-green-600">{request.students.length}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">Список группы</h4>
                            <Badge variant="secondary">{request.students.length} чел.</Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                          >
                            <Icon name={expandedRequest === request.id ? "ChevronUp" : "ChevronDown"} size={14} className="mr-1" />
                            {expandedRequest === request.id ? "Скрыть список" : "Показать список"}
                          </Button>
                        </div>
                        
                        {expandedRequest === request.id && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ФИО</TableHead>
                                <TableHead>Должность</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>СНИЛС</TableHead>
                                <TableHead>Курсы</TableHead>
                                <TableHead>Статус</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {request.students.map((student) => {
                                const studentCourses = student.courseIds.map(id => mockCourses.find(c => c.id === id)).filter(Boolean);
                                return (
                                  <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.position}</TableCell>
                                    <TableCell className="text-muted-foreground">{student.email || '—'}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {student.snils ? (
                                          <>
                                            <Icon name="CheckCircle2" size={14} className="text-green-600" />
                                            <span className="text-green-600 text-sm">Указан</span>
                                          </>
                                        ) : (
                                          <>
                                            <Icon name="AlertCircle" size={14} className="text-orange-500" />
                                            <span className="text-orange-500 text-sm">Не указан</span>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {studentCourses.map((course) => (
                                          <Badge key={course.id} variant="secondary" className="text-xs">
                                            {course.title}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {student.studentId ? (
                                        <Badge className="bg-green-100 text-green-700">Обучается</Badge>
                                      ) : (
                                        <Badge variant="outline">Не назначен</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}

                        <div className="flex gap-2 pt-4 border-t">
                          <Button className="flex-1" variant="default">
                            <Icon name="FileText" size={16} className="mr-2" />
                            Сформировать отчет для организации
                          </Button>
                          <Button className="flex-1" variant="default">
                            <Icon name="Award" size={16} className="mr-2" />
                            Отправить все удостоверения
                          </Button>
                          <Button variant="outline">
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать архив
                          </Button>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">Контактное лицо:</p>
                            <p className="text-blue-700">{org?.contactPerson} — {org?.contactEmail}, {org?.contactPhone}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

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
                          <Label>ФИО *</Label>
                          <Input placeholder="Иванов Иван Иванович" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="ivanov@mail.ru" />
                        </div>
                        <div>
                          <Label>СНИЛС *</Label>
                          <Input placeholder="123-456-789 00" maxLength={14} />
                          <p className="text-xs text-muted-foreground mt-1">Необходим для внесения в ФИС ФРДО</p>
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
                <div className="mb-4 flex gap-3 items-center">
                  <Input
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  {(searchTerm || nameFilter || organizationFilter || groupFilter) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setNameFilter('');
                        setOrganizationFilter('');
                        setGroupFilter('');
                      }}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
<Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>ФИО</div>
                          <Input
                            placeholder="Фильтр..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="h-8 text-xs font-normal"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Организация</div>
                          <Input
                            placeholder="Фильтр..."
                            value={organizationFilter}
                            onChange={(e) => setOrganizationFilter(e.target.value)}
                            className="h-8 text-xs font-normal"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Группа</div>
                          <Input
                            placeholder="Фильтр..."
                            value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)}
                            className="h-8 text-xs font-normal"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead>СНИЛС</TableHead>
                      <TableHead>Курсы</TableHead>
                      <TableHead>Логин</TableHead>
                      <TableHead>Пароль</TableHead>
                      <TableHead>Управление</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const assignments = getStudentAssignments(student.id);
                      const isExpanded = expandedStudent === student.id;
                      const org = mockOrganizations[0];
                      
                      return (
                        <>
                          <TableRow 
                            key={student.id} 
                            className={`cursor-pointer hover:bg-muted/50 ${isExpanded ? 'bg-muted/30' : ''}`}
                            onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="rounded border-gray-300" />
                            </TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell className="text-muted-foreground">{student.organization || 'Не указана'}</TableCell>
                            <TableCell className="text-muted-foreground">{student.group || 'Не указана'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {student.snils ? (
                                  <>
                                    <Icon name="CheckCircle2" size={14} className="text-green-600" />
                                    <span className="text-green-600 text-sm">Указан</span>
                                  </>
                                ) : (
                                  <>
                                    <Icon name="AlertCircle" size={14} className="text-orange-500" />
                                    <span className="text-orange-500 text-sm">Не указан</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0"
                                  title="Просмотр курсов"
                                >
                                  <Icon name="Eye" size={16} className="text-blue-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0"
                                  title="Добавить курс"
                                >
                                  <Icon name="Plus" size={16} className="text-green-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0"
                                  title="Статистика"
                                >
                                  <Icon name="BarChart3" size={16} className="text-purple-600" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-muted px-2 py-1 rounded">{student.login || student.email.split('@')[0]}</code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(student.login || student.email.split('@')[0], student.id)}
                                  title="Копировать логин"
                                >
                                  <Icon 
                                    name={copiedLogin === student.id ? "Check" : "Copy"} 
                                    size={14} 
                                    className={copiedLogin === student.id ? "text-green-600" : ""}
                                  />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <code className="text-sm">{student.password || '••••••••'}</code>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  title="Редактировать"
                                >
                                  <Icon name="Pencil" size={16} className="text-blue-600" />
                                </Button>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked className="sr-only peer" />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-blue-50/50 p-0">
                                <div className="p-4 space-y-3">
                                  <h4 className="font-semibold text-blue-900 mb-3">
                                    Назначенные курсы: {student.name}
                                  </h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-white">
                                        <TableHead>Наименование курса</TableHead>
                                        <TableHead>Дата начала</TableHead>
                                        <TableHead>Дата завершения</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead>Прогресс</TableHead>
                                        <TableHead>Действия</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {assignments.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                            Курсы не назначены
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        assignments.map((assignment) => {
                                          const calculateEndDate = (startDate: string | undefined) => {
                                            if (!startDate) return '';
                                            const start = new Date(startDate);
                                            const end = new Date(start);
                                            end.setDate(end.getDate() + 60);
                                            return end.toISOString().split('T')[0];
                                          };

                                          return (
                                            <TableRow key={assignment.id} className="bg-white">
                                              <TableCell className="font-medium">
                                                {assignment.course?.title}
                                              </TableCell>
                                              <TableCell>
                                                <Input 
                                                  type="date" 
                                                  defaultValue={assignment.activatedAt?.split('T')[0] || ''}
                                                  className="w-40"
                                                  onClick={(e) => e.stopPropagation()}
                                                  disabled={assignment.status === 'draft'}
                                                  placeholder={assignment.status === 'draft' ? 'Не активирован' : ''}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <Input 
                                                  type="text"
                                                  value={assignment.expiresAt ? new Date(assignment.expiresAt).toLocaleDateString('ru-RU') : '—'}
                                                  className="w-40"
                                                  disabled
                                                  placeholder="ДД.ММ.ГГГГ"
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <Badge 
                                                  variant="outline"
                                                  className={
                                                    assignment.status === 'completed' 
                                                      ? 'bg-green-100 text-green-700 border-green-300' 
                                                      : assignment.status === 'active'
                                                      ? 'bg-pink-100 text-pink-700 border-pink-300'
                                                      : 'bg-gray-100 text-gray-700 border-gray-300'
                                                  }
                                                >
                                                  {assignment.status === 'completed' ? 'Завершено' : assignment.status === 'active' ? 'Активно' : 'Черновик'}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex items-center gap-3 min-w-[140px]">
                                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                      className={`h-full rounded-full transition-all ${
                                                        assignment.progress === 100 
                                                          ? 'bg-purple-600' 
                                                          : assignment.progress >= 50
                                                          ? 'bg-indigo-600'
                                                          : 'bg-pink-600'
                                                      }`}
                                                      style={{ width: `${assignment.progress}%` }}
                                                    />
                                                  </div>
                                                  <span className="text-sm font-semibold min-w-[45px] text-right">
                                                    {assignment.progress}%
                                                  </span>
                                                </div>
                                              </TableCell>
                                              <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-1">
                                                  {assignment.status === 'draft' && (
                                                    <Button 
                                                      size="sm" 
                                                      variant="ghost" 
                                                      className="h-8 w-8 p-0"
                                                      title="Активировать подписку"
                                                    >
                                                      <Icon name="Play" size={16} className="text-green-600" />
                                                    </Button>
                                                  )}
                                                  {assignment.status === 'active' && (
                                                    <Button 
                                                      size="sm" 
                                                      variant="ghost" 
                                                      className="h-8 w-8 p-0"
                                                      title="Продлить (+1 подписка, +60 дней)"
                                                    >
                                                      <Icon name="RefreshCw" size={16} className="text-blue-600" />
                                                    </Button>
                                                  )}
                                                  <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0"
                                                    title="Завершить обучение"
                                                  >
                                                    <Icon name="CheckCircle2" size={16} className="text-green-600" />
                                                  </Button>
                                                  <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0"
                                                    title="Удалить назначение"
                                                  >
                                                    <Icon name="Trash2" size={16} className="text-red-600" />
                                                  </Button>
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки организации</CardTitle>
                <CardDescription>Управление параметрами и конфигурацией вашей организации</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Icon name="Settings" size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Раздел в разработке</p>
                  </div>
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