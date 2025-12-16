import { useState } from 'react';
import { X } from 'lucide-react';
import { UserData, MedicalInfo } from '../App';
import MedicalInfoForm from './MedicalInfoForm';
import logoImage from 'figma:asset/2d51b70905d6d493caf0a9ddf40df894eae573ea.png';

interface LoginPageProps {
  onLogin: (user: UserData) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showModal, setShowModal] = useState(true);
  const [modalType, setModalType] = useState<'login' | 'signup' | 'medical'>('login');
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [users, setUsers] = useState<UserData[]>([]);

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    if (!loginData.username) newErrors.username = 'Username is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};
    if (!signupData.username) newErrors.username = 'Username is required';
    if (!signupData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Email is invalid';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
      if (user) {
        onLogin(user);
      } else {
        setErrors({ login: 'Invalid username or password' });
      }
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      setModalType('medical');
    }
  };

  const handleMedicalInfoSubmit = (medicalInfo: MedicalInfo) => {
    const newUser: UserData = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      medicalInfo,
    };
    setUsers([...users, newUser]);
    setModalType('login');
    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#309898]/10 via-white to-[#FF8000]/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#309898]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8000]/5 rounded-full blur-3xl"></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#309898] to-[#FF8000]"></div>
            
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <img src={logoImage} alt="Vytara Logo" className="h-24 w-24 object-contain" />
              </div>
              
              <h1 className="text-center text-[#309898] mb-2">Vytara</h1>
              <p className="text-center text-gray-600 mb-6">Your Health Records, Simplified</p>

              {modalType === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Enter your username"
                    />
                    {errors.username && <p className="text-red-500 mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  {errors.login && <p className="text-red-500 text-center">{errors.login}</p>}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#309898] to-[#309898]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Login
                  </button>

                  <div className="flex justify-between mt-4">
                    <button type="button" className="text-[#FF8000] hover:underline">
                      Forgot Password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalType('signup');
                        setErrors({});
                      }}
                      className="text-[#309898] hover:underline"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={signupData.username}
                      onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Choose a username"
                    />
                    {errors.username && <p className="text-red-500 mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Re-enter Password</label>
                    <input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#309898] focus:outline-none transition-colors"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF8000] to-[#FF8000]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType('login');
                        setErrors({});
                      }}
                      className="text-[#309898] hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'medical' && (
                <MedicalInfoForm
                  onSubmit={handleMedicalInfoSubmit}
                  onBack={() => setModalType('signup')}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
