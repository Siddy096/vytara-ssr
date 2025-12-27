"use client";

import { useState, useRef, useEffect } from 'react';
// import { X } from 'lucide-react'; // Commented out if not used
import { useRouter } from 'next/navigation'; // <--- CHANGED: Used for redirection
import { MedicalInfoForm } from '@/components/MedicalInfoForm'; // <--- CHANGED: Point to correct components folder
import { MedicalInfo, UserData } from '@/lib/types';

/* ========================= PLASMA BACKGROUND ========================= */
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: 'forward' | 'reverse' | 'pingpong';
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];

    const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = containerRef.current!.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);
    setSize();

    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      let timeValue = (t - t0) * 0.001;
      if (direction === 'pingpong') {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
        (program.uniforms.uDirection as any).value = 1.0;
        (program.uniforms.iTime as any).value = pingpongTime;
      } else {
        (program.uniforms.iTime as any).value = timeValue;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive && containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      try {
        containerRef.current?.removeChild(canvas);
      } catch {}
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="w-full h-full relative overflow-hidden" />;
};

export default function LoginPage() { // <--- CHANGED: Removed props (Pages don't take props)
  const router = useRouter(); // <--- CHANGED: Initialize router
  
  const [showModal, setShowModal] = useState(true);
  const [modalType, setModalType] = useState<'login' | 'signup' | 'medical'>('login');
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [users, setUsers] = useState<UserData[]>([]);

  // <--- CHANGED: Using a placeholder for the logo for now
  const logoImage = "/assets/vytara-logo.png";
 

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
      // NOTE: In a real app, you would check a database here.
      // For now, we accept anyone or check the local 'users' state.
      
      const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
      
      // TEMPORARY FIX: Allow login if user exists OR just for testing
      if (user || true) {
        console.log("Logged in!");
        router.push('/home'); // Redirect to homepage
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

  const handleMedicalInfoSubmit = (userData: UserData) => {
    const newUser: UserData = {
      ...userData,
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
    };
    setUsers([...users, newUser]);
    setModalType('login');
    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 z-0">
        <Plasma
          color="#14b8a6"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>
      <div className="relative z-10">

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#14b8a6] to-[#134E4A]"></div>
            
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <img
                  src={logoImage}
                  alt="Vytara Logo"
                  className="h-24 w-24 object-contain"
                />
              </div>  

              <h1 className="text-center text-[#14b8a6] mb-2">Vytara</h1>
              <p className="text-center text-gray-600 mb-6">Your Health Records, Simplified</p>

              {modalType === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14b8a6] focus:outline-none transition-colors text-black"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14b8a6] focus:outline-none transition-colors text-black"
                      placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  {errors.login && <p className="text-red-500 text-center">{errors.login}</p>}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#14b8a6] to-[#134E4A] text-white py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Login
                  </button>

                  <div className="flex justify-between mt-4">
                    <button type="button" className="text-[#134E4A] hover:underline">
                      Forgot Password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalType('signup');
                        setErrors({});
                      }}
                      className="text-[#14b8a6] hover:underline"
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
                      onChange={(e) =>
                        setSignupData({ ...signupData, username: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black"
                    />
                    {errors.username && (
                      <p className="text-red-500 mt-1">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black"
                    />
                    {errors.email && (
                      <p className="text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black"
                    />
                    {errors.password && (
                      <p className="text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#14b8a6] to-[#134E4A] text-white py-3 rounded-xl"
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
                  onComplete={handleMedicalInfoSubmit}
                  onClose={() => setModalType('signup')}
                />
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
