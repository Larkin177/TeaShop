import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';
import { useUserStore } from '../store';
import { Phone } from '../components/Icons';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useUserStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone.trim()) return setError('请输入手机号');
    if (!password.trim()) return setError('请输入密码');
    setError('');
    setLoading(true);
    try {
      const res: any = await api.login(phone, password);
      storeLogin(res.data.user, res.data.token);
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col px-6 pt-20">
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-card-lg">
          <span className="text-4xl">🍵</span>
        </div>
        <h1 className="text-2xl font-bold text-guming-text">古茗茶饮</h1>
        <p className="text-sm text-guming-sub mt-1">好茶好料好味道</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <circle cx="12" cy="18" r="1" fill="#999" />
          </svg>
          <input
            type="tel"
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-transparent text-sm text-guming-text placeholder:text-guming-sub outline-none"
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent text-sm text-guming-text placeholder:text-guming-sub outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full gradient-brand text-white font-medium py-3.5 rounded-full shadow-card active:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>

      <div className="text-center mt-6">
        <Link to="/register" className="text-sm text-guming-sub">
          还没有账号？<span className="text-brand-500">立即注册</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;