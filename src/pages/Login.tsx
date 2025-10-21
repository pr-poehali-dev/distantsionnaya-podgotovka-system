import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Icon name="Shield" className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">EduPlatform</h1>
              <p className="text-gray-600">Система управления обучением</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Мультитенантная архитектура</h3>
                  <p className="text-sm text-gray-600">Управление несколькими организациями в одной системе</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="GraduationCap" className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Аттестация персонала</h3>
                  <p className="text-sm text-gray-600">Контроль сроков, интеграция с Ростехнадзором</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="BarChart3" className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Аналитика и отчеты</h3>
                  <p className="text-sm text-gray-600">Матрицы компетенций, gap-анализ, статистика</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Вход в систему</h2>
              <p className="text-gray-600">Введите ваши учетные данные</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.ru"
                    className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="ShieldCheck" size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Пароль</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name={showPassword ? "EyeOff" : "ShieldCheck"} size={18} />
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-6 text-base"
              >
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
