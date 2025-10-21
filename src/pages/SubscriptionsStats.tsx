import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { mockUsers, mockCourses, mockAssignments, mockOrganizations } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const SubscriptionsStats = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredAssignments = mockAssignments.filter(assignment => {
    if (!assignment.activatedAt) return false;
    const activatedDate = new Date(assignment.activatedAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return activatedDate >= start && activatedDate <= end;
  });

  const subscriptionHistory = filteredAssignments.flatMap(assignment => {
    const student = mockUsers.find(u => u.id === assignment.studentId);
    const course = mockCourses.find(c => c.id === assignment.courseId);
    const org = mockOrganizations.find(o => o.id === student?.organizationId) || mockOrganizations[0];
    
    const records = [];
    
    if (assignment.activatedAt) {
      records.push({
        id: `${assignment.id}-activation`,
        organizationName: org?.name || 'Не указана',
        studentName: student?.name || 'Неизвестен',
        courseName: course?.title || 'Неизвестен',
        actionDate: assignment.activatedAt,
        actionType: 'activation' as const,
        subscriptionsUsed: 1,
      });
    }
    
    if (assignment.subscriptionsUsed > 1) {
      records.push({
        id: `${assignment.id}-extension`,
        organizationName: org?.name || 'Не указана',
        studentName: student?.name || 'Неизвестен',
        courseName: course?.title || 'Неизвестен',
        actionDate: assignment.expiresAt || assignment.activatedAt || '',
        actionType: 'extension' as const,
        subscriptionsUsed: assignment.subscriptionsUsed - 1,
      });
    }
    
    return records;
  }).sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime());

  const totalUsed = subscriptionHistory.reduce((sum, record) => sum + record.subscriptionsUsed, 0);

  const exportToExcel = () => {
    const headers = ['Организация', 'ФИО слушателя', 'Курс подготовки', 'Дата активации', 'Действие', 'Подписок использовано'];
    const rows = subscriptionHistory.map(record => [
      record.organizationName,
      record.studentName,
      record.courseName,
      new Date(record.actionDate).toLocaleDateString('ru-RU'),
      record.actionType === 'activation' ? 'Активация' : 'Продление',
      record.subscriptionsUsed,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscriptions_stats_${startDate}_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад в админку
              </Button>
            </div>
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <Icon name="BarChart3" className="text-white" size={18} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Статистика списания подписок
          </h1>
          <p className="text-muted-foreground text-lg">
            История активаций и продлений подписок
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего списаний
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-indigo-600">{totalUsed}</div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingDown" className="text-indigo-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Активаций
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">
                  {subscriptionHistory.filter(r => r.actionType === 'activation').length}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="Play" className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Продлений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">
                  {subscriptionHistory.filter(r => r.actionType === 'extension').length}
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon name="RefreshCw" className="text-orange-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>История списаний</CardTitle>
                <CardDescription>Детальная информация о каждом списании подписки</CardDescription>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">Период:</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button onClick={exportToExcel}>
                  <Icon name="Download" size={16} className="mr-2" />
                  Скачать Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Организация</TableHead>
                  <TableHead>ФИО слушателя</TableHead>
                  <TableHead>Курс подготовки</TableHead>
                  <TableHead>Дата активации</TableHead>
                  <TableHead>Действие</TableHead>
                  <TableHead className="text-right">Подписок использовано</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Нет данных за выбранный период
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptionHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.organizationName}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.courseName}</TableCell>
                      <TableCell>{new Date(record.actionDate).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            record.actionType === 'activation'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-orange-100 text-orange-700 border-orange-300'
                          }
                        >
                          {record.actionType === 'activation' ? 'Активация' : 'Продление'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{record.subscriptionsUsed}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionsStats;
