import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';
import { useUserStore } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useUserStore((s) => s.login);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('请输入手机号和密码');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res: any = await api.login(phone, password);
      loginStore(res.data.user, res.data.token);
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(e?.message || '登录失败');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8" style={{ background: '#f8f5f0' }}>
      {/* Logo */}
      <div className="mb-6 text-center">
        <span className="text-5xl">🍵</span>
        <h1 className="text-[22px] font-bold text-gray-800 mt-2">古茗茶饮</h1>
        <p className="text-[13px] text-gray-400 mt-1">好茶好料好味道</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg text-[12px]" style={{ background: '#fff3e0', color: '#e85c3a' }}>
            {error}
          </div>
        )}
        <div className="flex items-center bg-white rounded-xl px-3 h-11 mb-3 shadow-sm">
          <span className="text-lg mr-2">📱</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
            maxLength={11}
            className="flex-1 text-[14px] bg-transparent border-none"
          />
        </div>
        <div className="flex items-center bg-white rounded-xl px-3 h-11 mb-4 shadow-sm">
          <span className="text-lg mr-2">🔒</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="flex-1 text-[14px] bg-transparent border-none"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-11 rounded-full text-white text-[15px] font-semibold"
          style={{ background: 'linear-gradient(135deg, #ff7a2e, #ff9651)' }}
        >
          {loading ? '登录中...' : '登录'}
        </button>

        <div className="flex items-center justify-center mt-4 gap-1">
          <span className="text-[12px] text-gray-400">还没有账号？</span>
          <Link to="/register" className="text-[12px] font-medium" style={{ color: '#ff7a2e' }}>
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;