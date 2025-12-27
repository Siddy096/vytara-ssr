
"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import type { UserData } from '@/types/user';

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


type Props = {
  onComplete: (data: UserData) => void;
  onClose?: () => void;
  initialData?: UserData;
  initialSection?: number;
};

export function MedicalInfoForm({ onComplete, onClose, initialData, initialSection }: Props) {
  const [currentSection, setCurrentSection] = useState(initialSection || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Section 1: Basic Personal Information
  const [personalInfo, setPersonalInfo] = useState(
    initialData?.personalInfo || {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      height: '',
      weight: '',
      contactNumber: '',
      emergencyContacts: [{ name: '', phone: '', relation: '' }],
    }
  );

  // Section 2: Current Medical Status
  const [currentMedical, setCurrentMedical] = useState(
    initialData?.currentMedical || {
      conditions: [''],
      medications: [{ name: '', dosage: '', frequency: '', course: '', purpose: '' }],
      allergies: [''],
      treatments: [''],
      doctors: [{ name: '', phone: '', speciality: '' }],
    }
  );

  // Section 3: Past Medical History
  const [pastMedical, setPastMedical] = useState(
    initialData?.pastMedical || {
      diseases: [''],
      surgeries: [{ name: '', date: '' }],
      hospitalizations: [{ reason: '', date: '' }],
      injuries: [''],
      childhoodIllnesses: [''],
      pastMedications: [''],
      longTermTreatments: [''],
    }
  );

  // Section 4: Family Medical History
  const [familyHistory, setFamilyHistory] = useState(
    initialData?.familyHistory && initialData.familyHistory.length > 0
      ? initialData.familyHistory
      : [{ disease: '', relation: '' }]
  );

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const calculateBMI = (height: string, weight: string) => {
    if (!height || !weight) return '';

    const weightKg = parseFloat(weight.replace(/[^\d.]/g, ''));
    if (isNaN(weightKg) || weightKg <= 0) return '';

    const heightCm = parseFloat(height.replace(/[^\d.]/g, ''));
    if (isNaN(heightCm) || heightCm <= 0) return '';

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const validateSection = (section: number) => {
    const newErrors: Record<string, string> = {};

    if (section === 1) {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!personalInfo.gender) newErrors.gender = 'Gender is required';
      if (!personalInfo.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!personalInfo.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
      else if (!validatePhoneNumber(personalInfo.contactNumber)) newErrors.contactNumber = 'Please enter a valid 10-digit phone number';

      // Validate emergency contact phone numbers
      personalInfo.emergencyContacts.forEach((contact, index) => {
        if (contact.phone.trim() && !validatePhoneNumber(contact.phone)) {
          newErrors[`emergencyPhone${index}`] = `Emergency contact ${index + 1}: Please enter a valid 10-digit phone number`;
        }
      });
    }

    if (section === 2) {
      // Validate doctor phone numbers
      currentMedical.doctors.forEach((doctor, index) => {
        if (doctor.phone.trim() && !validatePhoneNumber(doctor.phone)) {
          newErrors[`doctorPhone${index}`] = `Doctor ${index + 1}: Please enter a valid 10-digit phone number`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 4) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    const data: UserData = {
      username: initialData?.username || '',
      email: initialData?.email || '',
      personalInfo: {
        ...personalInfo,
        emergencyContacts: personalInfo.emergencyContacts.filter(c => c.name && c.phone && c.relation),
      },
      currentMedical: {
        conditions: currentMedical.conditions.filter(c => c.trim()),
        medications: currentMedical.medications.filter(m => m.name.trim() && m.dosage.trim() && m.frequency.trim() && m.course.trim() && m.purpose.trim()),
        allergies: currentMedical.allergies.filter(a => a.trim()),
        treatments: currentMedical.treatments.filter(t => t.trim()),
        doctors: currentMedical.doctors.filter(d => d.name.trim() && d.phone.trim()),
      },
      pastMedical: {
        diseases: pastMedical.diseases.filter(d => d.trim()),
        surgeries: pastMedical.surgeries.filter(s => s.name.trim()),
        hospitalizations: pastMedical.hospitalizations.filter(h => h.reason.trim()),
        injuries: pastMedical.injuries.filter(i => i.trim()),
        childhoodIllnesses: pastMedical.childhoodIllnesses.filter(c => c.trim()),
        pastMedications: pastMedical.pastMedications.filter(m => m.trim()),
        longTermTreatments: pastMedical.longTermTreatments.filter(t => t.trim()),
      },
      familyHistory: familyHistory.filter(f => f.disease.trim() && f.relation.trim()),
    };
    
    onComplete(data);
  };

  const addEmergencyContact = () => {
    if (personalInfo.emergencyContacts.length < 5) {
      setPersonalInfo({
        ...personalInfo,
        emergencyContacts: [...personalInfo.emergencyContacts, { name: '', phone: '', relation: '' }],
      });
    }
  };

  const removeEmergencyContact = (index: number) => {
    const newContacts = personalInfo.emergencyContacts.filter((_, i) => i !== index);
    setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
  };

  const removeCondition = (index: number) => {
    const newConditions = currentMedical.conditions.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, conditions: newConditions });
  };

  const removeMedication = (index: number) => {
    const newMedications = currentMedical.medications.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, medications: newMedications });
  };

  const removeAllergy = (index: number) => {
    const newAllergies = currentMedical.allergies.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, allergies: newAllergies });
  };

  const removeTreatment = (index: number) => {
    const newTreatments = currentMedical.treatments.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, treatments: newTreatments });
  };

  const removeDoctor = (index: number) => {
    const newDoctors = currentMedical.doctors.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, doctors: newDoctors });
  };

  const removeDisease = (index: number) => {
    const newDiseases = pastMedical.diseases.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, diseases: newDiseases });
  };

  const removeSurgery = (index: number) => {
    const newSurgeries = pastMedical.surgeries.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, surgeries: newSurgeries });
  };

  const removeHospitalization = (index: number) => {
    const newHospitalizations = pastMedical.hospitalizations.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, hospitalizations: newHospitalizations });
  };

  const removeInjury = (index: number) => {
    const newInjuries = pastMedical.injuries.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, injuries: newInjuries });
  };

  const removeChildhoodIllness = (index: number) => {
    const newIllnesses = pastMedical.childhoodIllnesses.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, childhoodIllnesses: newIllnesses });
  };

  const removePastMedication = (index: number) => {
    const newMedications = pastMedical.pastMedications.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, pastMedications: newMedications });
  };

  const removeLongTermTreatment = (index: number) => {
    const newTreatments = pastMedical.longTermTreatments.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, longTermTreatments: newTreatments });
  };

  const removeFamilyHistory = (index: number) => {
    const newHistory = familyHistory.filter((_, i) => i !== index);
    setFamilyHistory(newHistory);
  };

  const addField = (section: string, field: string) => {
    if (section === 'current') {
      if (field === 'conditions') {
        setCurrentMedical({ ...currentMedical, conditions: [...currentMedical.conditions, ''] });
      } else if (field === 'medications') {
        setCurrentMedical({
          ...currentMedical,
          medications: [...currentMedical.medications, { name: '', dosage: '', frequency: '', course: '', purpose: '' }],
        });
      } else if (field === 'allergies') {
        setCurrentMedical({ ...currentMedical, allergies: [...currentMedical.allergies, ''] });
      } else if (field === 'treatments') {
        setCurrentMedical({ ...currentMedical, treatments: [...currentMedical.treatments, ''] });
      } else if (field === 'doctors') {
        setCurrentMedical({ ...currentMedical, doctors: [...currentMedical.doctors, { name: '', phone: '', speciality: '' }] });
      }
    } else if (section === 'past') {
      if (field === 'diseases') {
        setPastMedical({ ...pastMedical, diseases: [...pastMedical.diseases, ''] });
      } else if (field === 'surgeries') {
        setPastMedical({
          ...pastMedical,
          surgeries: [...pastMedical.surgeries, { name: '', date: '' }],
        });
      } else if (field === 'hospitalizations') {
        setPastMedical({
          ...pastMedical,
          hospitalizations: [...pastMedical.hospitalizations, { reason: '', date: '' }],
        });
      } else if (field === 'injuries') {
        setPastMedical({ ...pastMedical, injuries: [...pastMedical.injuries, ''] });
      } else if (field === 'childhoodIllnesses') {
        setPastMedical({
          ...pastMedical,
          childhoodIllnesses: [...pastMedical.childhoodIllnesses, ''],
        });
      } else if (field === 'pastMedications') {
        setPastMedical({
          ...pastMedical,
          pastMedications: [...pastMedical.pastMedications, ''],
        });
      } else if (field === 'longTermTreatments') {
        setPastMedical({
          ...pastMedical,
          longTermTreatments: [...pastMedical.longTermTreatments, ''],
        });
      }
    } else if (section === 'family') {
      setFamilyHistory([...familyHistory, { disease: '', relation: '' }]);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `select option { color: black; }`}} />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto z-50 relative">
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
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 my-8 border-4 border-[#14b8a6] relative max-h-[85vh] overflow-y-auto z-10">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="flex justify-center mb-3">
          <img
            src="/assets/vytara-logo.png"
            alt="Vytara Logo"
            width={32}
            height={32}
          />

        </div>
        
        <h2 className="text-center text-[#309898] mb-1">Medical Information</h2>
        <p className="text-center text-gray-600 mb-4 text-sm">Section {currentSection}/4</p>

        <div className="min-h-[400px]">
          {/* Section 1: Basic Personal Information */}
          {currentSection === 1 && (
            <div className="space-y-4">
              <h3 className="text-[#14b8a6] mb-4">Basic Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#14b8a6] mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder='eg: Jane Doe'
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black placeholder:text-gray-500"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">Gender *</label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">Blood Group *</label>
                  <select
                    value={personalInfo.bloodGroup}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Height (cm)</label>
                  <input
                    type="text"
                    placeholder="eg: 170"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, height: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">Weight (kg)</label>
                  <input
                    type="text"
                    placeholder="eg: 70"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, weight: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">BMI</label>
                  <input
                    type="text"
                    value={calculateBMI(personalInfo.height, personalInfo.weight)}
                    readOnly
                    placeholder="eg: 22.5"
                    className="text-black placeholder:text-gray-500 w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#14b8a6] mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    value={personalInfo.contactNumber}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, contactNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black placeholder:text-gray-500"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#14b8a6]">Emergency Contacts</label>
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    disabled={personalInfo.emergencyContacts.length >= 5}
                    className="text-[#134E4A] hover:text-[#14b8a6] disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {personalInfo.emergencyContacts.map((contact, index) => (
                  <div key={index} className="mb-3">
                    <div className="grid grid-cols-3 gap-2 mb-1">
                      <input
                        type="text"
                        placeholder="eg: John Doe"
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].name = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#14b8a6]/30 focus:border-[#134E4A] focus:outline-none text-black placeholder:text-gray-500"
                      />
                      <input
                        type="tel"
                        placeholder="eg: 9876543210"
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].phone = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="eg: Father"
                        value={contact.relation}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].relation = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <span className="text-xs text-[#309898] font-semibold bg-[#309898]/10 px-3 py-1 rounded-lg">Primary Contact</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newContacts = [...personalInfo.emergencyContacts];
                              const [movedContact] = newContacts.splice(index, 1);
                              newContacts.unshift(movedContact);
                              setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                            }}
                            className="text-xs px-3 py-1 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                      {personalInfo.emergencyContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmergencyContact(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {errors[`emergencyPhone${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`emergencyPhone${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Current Medical Status */}
          {currentSection === 2 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Current Medical Status</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Current Diagnosed Conditions</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'conditions')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Diabetes"
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...currentMedical.conditions];
                        newConditions[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, conditions: newConditions });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {currentMedical.conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
  <div className="flex items-center justify-between mb-2">
    <label className="block text-[#309898]">Current Medications</label>
    <button
      type="button"
      onClick={() => addField('current', 'medications')}
      className="text-[#FF8000] hover:text-[#309898]"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>

  {currentMedical.medications.map((med, index) => (
    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-2">
        <input
          type="text"
          placeholder="eg: Aspirin"
          value={med.name}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].name = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
        />
        <input
          type="text"
          placeholder="eg: 500mg"
          value={med.dosage}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].dosage = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
        />
        <input
          type="text"
          placeholder="eg: Twice daily"
          value={med.frequency}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].frequency = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
        />
        <input
          type="text"
          placeholder="eg: 7 days"
          value={med.course}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].course = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
        />
        <input
          type="text"
          placeholder="eg: Pain relief"
          value={med.purpose}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].purpose = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
        />
      </div>
      {currentMedical.medications.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => removeMedication(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  ))}
</div>


              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Allergies</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'allergies')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.allergies.map((allergy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Peanuts"
                      value={allergy}
                      onChange={(e) => {
                        const newAllergies = [...currentMedical.allergies];
                        newAllergies[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, allergies: newAllergies });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {currentMedical.allergies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Ongoing Treatments / Therapies</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'treatments')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.treatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Physiotherapy"
                      value={treatment}
                      onChange={(e) => {
                        const newTreatments = [...currentMedical.treatments];
                        newTreatments[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, treatments: newTreatments });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {currentMedical.treatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatment(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Current Doctor / Physician</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'doctors')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.doctors.map((doctor, index) => (
                  <div key={index} className="mb-3">
                    <div className="grid grid-cols-3 gap-2 mb-1">
                      <input
                        type="text"
                        placeholder="eg: Dr. Smith"
                        value={doctor.name}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].name = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                      />
                      <input
                        type="tel"
                        placeholder="eg: 9876543210"
                        value={doctor.phone}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].phone = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="eg: Cardiologist"
                        value={doctor.speciality}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].speciality = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        {index === 0 ? (
                          <span className="text-xs text-[#309898] font-semibold bg-[#309898]/10 px-3 py-1 rounded-lg">Primary Doctor</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newDoctors = [...currentMedical.doctors];
                              const [movedDoctor] = newDoctors.splice(index, 1);
                              newDoctors.unshift(movedDoctor);
                              setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                            }}
                            className="text-xs px-3 py-1 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                      {currentMedical.doctors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDoctor(index)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Past Medical History */}
          {currentSection === 3 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Past Medical History</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Previous Diagnosed Diseases</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'diseases')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.diseases.map((disease, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Hypertension"
                      value={disease}
                      onChange={(e) => {
                        const newDiseases = [...pastMedical.diseases];
                        newDiseases[index] = e.target.value;
                        setPastMedical({ ...pastMedical, diseases: newDiseases });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {pastMedical.diseases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDisease(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Surgeries</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'surgeries')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.surgeries.map((surgery, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Appendectomy"
                      value={surgery.name}
                      onChange={(e) => {
                        const newSurgeries = [...pastMedical.surgeries];
                        newSurgeries[index].name = e.target.value;
                        setPastMedical({ ...pastMedical, surgeries: newSurgeries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
                    />
                    <input
                      type="date"
                      value={surgery.date}
                      onChange={(e) => {
                        const newSurgeries = [...pastMedical.surgeries];
                        newSurgeries[index].date = e.target.value;
                        setPastMedical({ ...pastMedical, surgeries: newSurgeries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                    />
                    {pastMedical.surgeries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSurgery(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Hospitalizations</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'hospitalizations')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.hospitalizations.map((hosp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Heart Surgery"
                      value={hosp.reason}
                      onChange={(e) => {
                        const newHosps = [...pastMedical.hospitalizations];
                        newHosps[index].reason = e.target.value;
                        setPastMedical({ ...pastMedical, hospitalizations: newHosps });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
                    />
                    <input
                      type="date"
                      value={hosp.date}
                      onChange={(e) => {
                        const newHosps = [...pastMedical.hospitalizations];
                        newHosps[index].date = e.target.value;
                        setPastMedical({ ...pastMedical, hospitalizations: newHosps });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
                    />
                    {pastMedical.hospitalizations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHospitalization(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Injuries</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'injuries')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.injuries.map((injury, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Broken Leg"
                      value={injury}
                      onChange={(e) => {
                        const newInjuries = [...pastMedical.injuries];
                        newInjuries[index] = e.target.value;
                        setPastMedical({ ...pastMedical, injuries: newInjuries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {pastMedical.injuries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInjury(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Childhood Illnesses</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'childhoodIllnesses')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.childhoodIllnesses.map((illness, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Chickenpox"
                      value={illness}
                      onChange={(e) => {
                        const newIllnesses = [...pastMedical.childhoodIllnesses];
                        newIllnesses[index] = e.target.value;
                        setPastMedical({ ...pastMedical, childhoodIllnesses: newIllnesses });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {pastMedical.childhoodIllnesses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChildhoodIllness(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Medications Taken</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'pastMedications')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.pastMedications.map((med, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Aspirin"
                      value={med}
                      onChange={(e) => {
                        const newMeds = [...pastMedical.pastMedications];
                        newMeds[index] = e.target.value;
                        setPastMedical({ ...pastMedical, pastMedications: newMeds });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {pastMedical.pastMedications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePastMedication(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Long-term Treatments Previously Taken</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'longTermTreatments')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.longTermTreatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Chemotherapy"
                      value={treatment}
                      onChange={(e) => {
                        const newTreatments = [...pastMedical.longTermTreatments];
                        newTreatments[index] = e.target.value;
                        setPastMedical({ ...pastMedical, longTermTreatments: newTreatments });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black"
                    />
                    {pastMedical.longTermTreatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLongTermTreatment(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Family Medical History */}
          {currentSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Family Medical History</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Diseases and Relation</label>
                  <button
                    type="button"
                    onClick={() => addField('family', '')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {familyHistory.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="eg: Cancer"
                      value={item.disease}
                      onChange={(e) => {
                        const newHistory = [...familyHistory];
                        newHistory[index].disease = e.target.value;
                        setFamilyHistory(newHistory);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="eg: Mother"
                      value={item.relation}
                      onChange={(e) => {
                        const newHistory = [...familyHistory];
                        newHistory[index].relation = e.target.value;
                        setFamilyHistory(newHistory);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none text-black placeholder:text-gray-500"
                    />
                    {familyHistory.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyHistory(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-8">
          {currentSection < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
            >
              Confirm and Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
