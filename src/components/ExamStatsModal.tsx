import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ExamAttempt {
  id: number;
  startedAt: string;
  finishedAt: string;
  timeSpentSeconds: number;
  correctAnswers: number;
  totalQuestions: number;
  status: 'passed' | 'failed';
}

interface ExamStatsModalProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  courseId: string;
}

export const ExamStatsModal = ({ open, onClose, studentId, courseId }: ExamStatsModalProps) => {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadAttempts();
    }
  }, [open, studentId, courseId]);

  const loadAttempts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/0c78602b-f1a2-42cd-bafa-aa660eb0135f?studentId=${studentId}&courseId=${courseId}`
      );
      const data = await response.json();
      setAttempts(data.attempts || []);
    } catch (error) {
      console.error('Failed to load exam attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} мин ${secs} сек`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="BarChart3" size={24} />
            Статистика экзаменационных попыток
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="animate-spin" size={32} />
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="ClipboardList" size={48} className="mx-auto mb-3 opacity-50" />
            <p>Пока нет попыток экзамена</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Дата</th>
                  <th className="text-left py-3 px-2">Начало</th>
                  <th className="text-left py-3 px-2">Окончание</th>
                  <th className="text-left py-3 px-2">Длительность</th>
                  <th className="text-left py-3 px-2">Результат</th>
                  <th className="text-left py-3 px-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{formatDate(attempt.startedAt)}</td>
                    <td className="py-3 px-2">{formatTime(attempt.startedAt)}</td>
                    <td className="py-3 px-2">{attempt.finishedAt ? formatTime(attempt.finishedAt) : '—'}</td>
                    <td className="py-3 px-2">{attempt.timeSpentSeconds ? formatDuration(attempt.timeSpentSeconds) : '—'}</td>
                    <td className="py-3 px-2 font-medium">
                      {attempt.correctAnswers} / {attempt.totalQuestions}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={attempt.status === 'passed' ? 'default' : 'destructive'}>
                        {attempt.status === 'passed' ? 'Сдал' : 'Не сдал'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExamStatsModal;
