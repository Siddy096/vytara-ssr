import { useState } from 'react';
import { X } from 'lucide-react';
import { MedicalInfoForm } from './MedicalInfoForm';
import { UserData } from '../App';
import logoImage from 'figma:asset/3356ef9e7b4ecad1a9839c039785983e296f414d.png';

type Props = {
  onLoginSuccess: (userData: UserData) => void;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
};

export function LoginSignupModal({ onLoginSuccess, onClose, initialMode = 'login' }: Props) {
  const [mode, setMode] = useState<'login' | 'signup' | 'medical'>(initialMode);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempUserData, setTempUserData] = useState<Partial<UserData> | null>(null);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!loginData.username.trim()) newErrors.username = 'Username is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    if (!signupData.username.trim()) newErrors.username = 'Username is required';
    if (!signupData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Email is invalid';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      // Mock login - create dummy user data and log in directly
      const mockUserData: UserData = {
        username: loginData.username,
        email: `${loginData.username}@example.com`,
        personalInfo: {
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          bloodGroup: 'O+',
          height: '5\'10"',
          weight: '70 kg',
          contactNumber: '+1234567890',
          emergencyContacts: [{ name: 'Jane Doe', phone: '+1234567891' }],
        },
        currentMedical: {
          conditions: [],
          medications: [],
          allergies: [],
          treatments: [],
          doctors: [],
        },
        pastMedical: {
          diseases: [],
          surgeries: [],
          hospitalizations: [],
          injuries: [],
          childhoodIllnesses: [],
          pastMedications: [],
          longTermTreatments: [],
        },
        familyHistory: [],
      };
      onLoginSuccess(mockUserData);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      setTempUserData({
        username: signupData.username,
        email: signupData.email,
      });
      setMode('medical');
    }
  };

  const handleMedicalFormComplete = (medicalData: Omit<UserData, 'username' | 'email'>) => {
    if (tempUserData) {
      const completeUserData: UserData = {
        username: tempUserData.username!,
        email: tempUserData.email!,
        ...medicalData,
      };
      onLoginSuccess(completeUserData);
    }
  };

  if (mode === 'medical') {
    return <MedicalInfoForm onComplete={handleMedicalFormComplete} onClose={onClose} initialData={tempUserData as UserData} />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#309898]/20 via-white to-[#FF8000]/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative border-4 border-[#309898] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoImage} alt="Vytara Logo" className="w-36 h-36" />
        </div>
        
        <h1 className="text-center text-[#309898] mb-2">Vytara</h1>
        <p className="text-center text-gray-600 mb-6">Your Personal Health Companion</p>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#309898] mb-2">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-[#309898] mb-2">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#309898] to-[#FF8000] text-white py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Login
            </button>

            <div className="flex justify-between text-sm mt-4">
              <button type="button" className="text-[#FF8000] hover:underline">
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrors({});
                }}
                className="text-[#309898] hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[#309898] mb-2">Username</label>
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-[#309898] mb-2">Email</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[#309898] mb-2">Password</label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[#309898] mb-2">Re-enter Password</label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none transition"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#309898] to-[#FF8000] text-white py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Sign Up
            </button>

            <div className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrors({});
                }}
                className="text-[#309898] hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}