import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Activity, FileText, Edit2,
  Download, Droplet, TrendingUp, Calculator, CalendarCheck,
  ChevronDown, Users, Menu, X, Pill, History, LogOut, Calendar
} from 'lucide-react';
import { UserData } from '../App';
import logoImage from '../assets/vytara logo.png';
import { MedicalInfoForm } from './MedicalInfoForm';

// --- MOCK DATA ---
const MOCK_HISTORY_DATA = [
  { id: 1, title: 'Annual Physical Checkup', doctor: 'Dr. Sarah Smith', date: '2025-11-15', type: 'General' },
  { id: 2, title: 'Dental Cleaning', doctor: 'Dr. Emily Chen', date: '2025-10-02', type: 'Dental' },
  { id: 3, title: 'Viral Fever Consultation', doctor: 'Dr. Sarah Smith', date: '2025-08-20', type: 'General' },
  { id: 4, title: 'Eye Vision Test', doctor: 'Dr. A. Patel', date: '2025-06-10', type: 'Vision' },
  { id: 5, title: 'Vaccination (Flu)', doctor: 'Dr. Sarah Smith', date: '2025-01-15', type: 'Immunization' },
];

const MOCK_FAMILY_PROFILES = [
  { id: 'user_002', name: 'Rahul Amberkar (Dad)', relation: 'Father', gender: 'Male', age: '52', blood: 'B+', conditions: ['Hypertension'] },
  { id: 'user_003', name: 'Priya Amberkar (Mom)', relation: 'Mother', gender: 'Female', age: '48', blood: 'O+', conditions: ['Diabetes T2', 'Thyroid'] },
  { id: 'user_004', name: 'Rohan (Brother)', relation: 'Sibling', gender: 'Male', age: '12', blood: 'A+', conditions: [] }
];

type Props = {
  userData: UserData;
  onNavigateToHome: () => void;
  onNavigateToVault: () => void;
  onLogout: () => void;
  onUpdateUserData: (data: UserData) => void;
};

export function ProfilePage({ userData, onNavigateToHome, onNavigateToVault, onLogout, onUpdateUserData }: Props) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState<any>(userData); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!displayUser.isMock) setDisplayUser(userData);
  }, [userData]);

  const handleProfileSwitch = (profile: any) => {
    if (profile === 'me') {
        setDisplayUser(userData); 
    } else {
        const mockUser: any = {
            ...userData, 
            isMock: true,
            personalInfo: {
                ...userData.personalInfo,
                fullName: profile.name,
                gender: profile.gender,
                bloodGroup: profile.blood,
                dateOfBirth: new Date(new Date().getFullYear() - parseInt(profile.age), 0, 1).toISOString(), 
            },
            currentMedical: {
                ...userData.currentMedical,
                conditions: profile.conditions,
                medications: profile.conditions.length > 0 ? [{ name: 'Metformin', dosage: '500mg', frequency: 'Daily' }] : [],
            }
        };
        setDisplayUser(mockUser);
    }
    setShowProfileMenu(false);
  };

  const getHistoricalEvents = () => {
    const today = new Date();
    return MOCK_HISTORY_DATA.filter((event) => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const historicalEvents = getHistoricalEvents();

  // --- BMI LOGIC (Safeguarded) ---
  const calculateBMI = () => {
    if ((displayUser as any).isMock) return '24.5';
    let h = parseFloat(displayUser.personalInfo.height || '0');
    const w = parseFloat(displayUser.personalInfo.weight || '0');

    // 1. If height is weirdly small (e.g. "5.9"), assume Feet and convert to CM
    if (h > 0 && h < 10) h = h * 30.48;

    // 2. Convert CM to Meters
    h = h / 100;

    if (h > 0 && w > 0) {
        const bmiValue = (w / (h * h));
        // 3. Final sanity check
        if (bmiValue > 100) return '--';
        return bmiValue.toFixed(1);
    }
    return '--';
  };

  const bmi = calculateBMI();
  const visitCount = (displayUser as any).isMock ? 12 : historicalEvents.length;

  const handleFormSubmit = (updatedData: UserData) => {
    onUpdateUserData(updatedData);
    if (!(displayUser as any).isMock) setDisplayUser(updatedData); 
    else alert("You cannot edit Family profiles in this view.");
    setShowEditForm(false);
  };

  const handleExportPDF = () => {
    const data = displayUser as UserData;

    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Vytara - Medical Profile</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #309898; }
              h2 { color: #FF8000; margin-top: 20px; }
              h3 { color: #309898; }
              .section { margin-bottom: 30px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; color: #309898; }
              .value { color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #309898; color: white; }
            </style>
          </head>
          <body>
            <h1>Vytara Medical Profile</h1>
            <div class="section">
              <h2>Personal Information</h2>
              <div class="field"><span class="label">Full Name:</span> ${data.personalInfo.fullName}</div>
              <div class="field"><span class="label">Email:</span> ${data.email}</div>
              <div class="field"><span class="label">Username:</span> @${data.username}</div>
              <div class="field"><span class="label">Date of Birth:</span> ${new Date(data.personalInfo.dateOfBirth).toLocaleDateString()}</div>
              <div class="field"><span class="label">Gender:</span> ${data.personalInfo.gender}</div>
              <div class="field"><span class="label">Blood Group:</span> ${data.personalInfo.bloodGroup}</div>
              <div class="field"><span class="label">Height:</span> ${data.personalInfo.height || 'Not specified'}</div>
              <div class="field"><span class="label">Weight:</span> ${data.personalInfo.weight || 'Not specified'}</div>
              <div class="field"><span class="label">BMI:</span> ${bmi}</div>
              <div class="field"><span class="label">Contact Number:</span> ${data.personalInfo.contactNumber}</div>
            </div>

            <div class="section">
              <h3>Emergency Contacts</h3>
              <table>
                <tr><th>Name</th><th>Phone</th><th>Relation</th><th>Status</th></tr>
                ${data.personalInfo.emergencyContacts.map((contact, idx) => `
                  <tr><td>${contact.name}</td><td>${contact.phone}</td><td>${contact.relation}</td><td>${idx === 0 ? '<strong>Primary</strong>' : ''}</td></tr>
                `).join('')}
              </table>
            </div>

            <div class="section">
              <h2>Current Medical Status</h2>
              ${data.currentMedical.conditions.length > 0 ? `
                <h3>Current Conditions</h3>
                <p>${data.currentMedical.conditions.join(', ')}</p>
              ` : ''}

              ${data.currentMedical.medications.length > 0 ? `
                <h3>Current Medications</h3>
                <table>
                  <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Course</th><th>Purpose</th></tr>
                  ${data.currentMedical.medications.map(med => `
                    <tr><td>${med.name}</td><td>${med.dosage}</td><td>${med.frequency}</td><td>${med.course || 'Not specified'}</td><td>${med.purpose || 'Not specified'}</td></tr>
                  `).join('')}
                </table>
              ` : ''}

              ${data.currentMedical.allergies.length > 0 ? `
                <h3>Allergies</h3>
                <p>${data.currentMedical.allergies.join(', ')}</p>
              ` : ''}

              ${data.currentMedical.treatments.length > 0 ? `
                <h3>Ongoing Treatments / Therapies</h3>
                <p>${data.currentMedical.treatments.join(', ')}</p>
              ` : ''}

              ${data.currentMedical.doctors.length > 0 ? `
                <h3>Current Doctors</h3>
                <table>
                  <tr><th>Name</th><th>Phone</th><th>Speciality</th><th>Status</th></tr>
                  ${data.currentMedical.doctors.map((doc, idx) => `
                    <tr><td>${doc.name}</td><td>${doc.phone}</td><td>${doc.speciality}</td><td>${idx === 0 ? '<strong>Primary</strong>' : ''}</td></tr>
                  `).join('')}
                </table>
              ` : ''}
            </div>

            <div class="section">
              <h2>Past Medical History</h2>
              ${data.pastMedical.diseases.length > 0 ? `
                <h3>Previous Diseases</h3>
                <p>${data.pastMedical.diseases.join(', ')}</p>
              ` : ''}

              ${data.pastMedical.surgeries.length > 0 ? `
                <h3>Past Surgeries</h3>
                <table>
                  <tr><th>Name</th><th>Date</th></tr>
                  ${data.pastMedical.surgeries.map(surgery => `
                    <tr><td>${surgery.name}</td><td>${surgery.date ? new Date(surgery.date).toLocaleDateString() : ''}</td></tr>
                  `).join('')}
                </table>
              ` : ''}

              ${data.pastMedical.hospitalizations.length > 0 ? `
                <h3>Hospitalizations</h3>
                <table>
                  <tr><th>Reason</th><th>Date</th></tr>
                  ${data.pastMedical.hospitalizations.map(hosp => `
                    <tr><td>${hosp.reason}</td><td>${hosp.date ? new Date(hosp.date).toLocaleDateString() : ''}</td></tr>
                  `).join('')}
                </table>
              ` : ''}

              ${data.pastMedical.injuries.length > 0 ? `
                <h3>Past Injuries</h3>
                <p>${data.pastMedical.injuries.join(', ')}</p>
              ` : ''}

              ${data.pastMedical.childhoodIllnesses.length > 0 ? `
                <h3>Childhood Illnesses</h3>
                <p>${data.pastMedical.childhoodIllnesses.join(', ')}</p>
              ` : ''}

              ${data.pastMedical.pastMedications.length > 0 ? `
                <h3>Past Medications Taken</h3>
                <p>${data.pastMedical.pastMedications.join(', ')}</p>
              ` : ''}

              ${data.pastMedical.longTermTreatments.length > 0 ? `
                <h3>Long-term Treatments Previously Taken</h3>
                <p>${data.pastMedical.longTermTreatments.join(', ')}</p>
              ` : ''}
            </div>

            ${data.familyHistory.length > 0 ? `
              <div class="section">
                <h2>Family Medical History</h2>
                <table>
                  <tr><th>Disease</th><th>Relation</th></tr>
                  ${data.familyHistory.map(item => `
                    <tr><td>${item.disease}</td><td>${item.relation}</td></tr>
                  `).join('')}
                </table>
              </div>
            ` : ''}

            <script>
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    // MAIN BACKGROUND: Smooth teal gradient transition (dark to light as you scroll)
    <div className="min-h-screen bg-gradient-to-b from-[#003B46] via-[#006770] via-[#00838B] to-[#00A3A9] pb-10 font-sans">
      
      {/* 1. Navbar - FORCED STYLE GRADIENT */}
      <header 
        className="sticky top-0 z-40 border-b border-white/20 shadow-sm"
        // INLINE STYLE TO FORCE THE GRADIENT - Teal Palette (starting from lighter shade)
        style={{ background: 'linear-gradient(90deg, #006770 0%, #00838B 40%, #00A3A9 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo - CIRCULAR WHITE CONTAINER */}
            <div className="flex items-center gap-3">
               {/* Container: White, Circular, Centered, Shadowed */}
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-2">
                  <img 
                    src={logoImage} 
                    alt="Vytara Logo" 
                    className="w-full h-full object-contain"
                    // Removed the white filter here
                  />
               </div>
              <h1 className="text-xl font-bold text-white tracking-wide">Vytara</h1>
            </div>
            
            {/* Hamburger Menu - WHITE TEXT */}
            <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg flex items-center justify-center transition border border-white/30 bg-white/10 backdrop-blur-sm"
                >
                  {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-50 bg-gray-50">
                        <p className="text-[10px] uppercase font-bold text-gray-400 px-2">Navigation</p>
                    </div>
                    <button onClick={() => { onNavigateToHome(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#309898] flex items-center gap-3 transition">Home</button>
                    <button onClick={() => { onNavigateToVault(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#309898] flex items-center gap-3 transition">Visit Vault</button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { handleExportPDF(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#309898] flex items-center gap-3 transition"><Download className="w-4 h-4" /> Export PDF</button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. THE HEADER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* LEFT: Basic Info & KPIs */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 flex flex-col justify-between relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80 pointer-events-none"></div>

            {/* Edit Button */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button onClick={() => setShowEditForm(true)} className="p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-[#FF8000] hover:bg-orange-50 rounded-full border border-gray-200 shadow-sm transition">
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>


            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8 mt-2 relative z-0">
              {/* Switch Profile Button & Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur hover:bg-white text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider transition border border-gray-200 shadow-sm"
                    >
                        <Users className="w-3 h-3 text-teal-600" />
                        <span>Switch Profile</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showProfileMenu && (
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            {MOCK_FAMILY_PROFILES.map((profile) => (
                                <button key={profile.id} onClick={() => handleProfileSwitch(profile)} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between">
                                    <span>{profile.name}</span>
                                </button>
                            ))}
                            <button onClick={() => handleProfileSwitch('me')} className="w-full text-left px-4 py-3 text-sm font-bold text-teal-600 hover:bg-teal-50 border-t border-gray-100">Back to Me</button>
                        </div>
                    )}
                </div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center border-[4px] border-white shadow-lg shrink-0">
                      <User className="w-10 h-10 text-teal-700/80" />
                </div>
              </div>

              <div className="flex-1 w-full pt-2">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{displayUser.personalInfo.fullName}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-full border border-blue-200">
                          {displayUser.personalInfo.gender}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">ID: @{displayUser.username}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center"><Mail className="w-3 h-3" /></div> 
                    <span className="truncate">{displayUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                      <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center"><Phone className="w-3 h-3" /></div>
                    <span>{displayUser.personalInfo.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                      <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center"><Calendar className="w-3 h-3" /></div>
                    <span>{new Date(displayUser.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- KPI SECTION --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {/* KPI 1 */}
               <div className="bg-red-50 p-4 rounded-2xl border border-red-100 hover:border-red-300 transition shadow-sm group">
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Droplet className="w-3 h-3 fill-red-400 text-red-400 group-hover:scale-110 transition" /> Blood
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{displayUser.personalInfo.bloodGroup}</p>
               </div>
               
               {/* KPI 2 */}
               <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 hover:border-blue-300 transition shadow-sm group">
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calculator className="w-3 h-3 text-blue-500 group-hover:scale-110 transition" /> BMI
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-800">{bmi}</p>
                    <span className="text-[10px] text-gray-500 font-medium">kg/m²</span>
                  </div>
               </div>

               {/* KPI 3 */}
               <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 hover:border-purple-300 transition shadow-sm group">
                  <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CalendarCheck className="w-3 h-3 text-purple-500 group-hover:scale-110 transition" /> Visits
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{visitCount}</p>
               </div>
            </div>
          </div>

          {/* RIGHT: Historical Visits */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600"><History className="w-4 h-4"/></div> 
                 Historical Visits
              </h3>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-2 custom-scrollbar">
              {historicalEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition cursor-pointer group border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-white group-hover:shadow-md flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-600 shrink-0 transition duration-300">
                      <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
                      <span className="text-[10px] font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="pt-0.5">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{event.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. MEDICAL INFORMATION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Current Medical Status */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-red-50 rounded-lg text-red-600"><Activity className="w-5 h-5" /></div>
              <h3 className="font-bold text-gray-800">Current Medical Status</h3>
            </div>
            
            <div className="space-y-6">
              {/* Current Diagnosed Conditions */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Current Diagnosed Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {displayUser.currentMedical.conditions.length > 0 ? 
                    displayUser.currentMedical.conditions.map((c:string, i:number) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{c}</span>
                    )) : <span className="text-gray-400 text-sm italic">No current conditions</span>
                  }
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {displayUser.currentMedical.allergies && displayUser.currentMedical.allergies.length > 0 ? 
                    displayUser.currentMedical.allergies.map((allergy:string, i:number) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium border border-orange-100">{allergy}</span>
                    )) : <span className="text-gray-400 text-sm italic">No known allergies</span>
                  }
                </div>
              </div>

              {/* Ongoing Treatments */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Ongoing Treatments</label>
                <div className="space-y-2">
                  {displayUser.currentMedical.medications.length > 0 ? 
                    displayUser.currentMedical.medications.map((med:any, i:number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-300 transition group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600"><Pill className="w-4 h-4" /></div>
                          <span className="font-bold text-gray-700">{med.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">{med.dosage}</span>
                      </div>
                    )) : <span className="text-gray-400 text-sm italic">No ongoing treatments</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Past Medical History */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><History className="w-5 h-5" /></div>
              <h3 className="font-bold text-gray-800">Past Medical History</h3>
            </div>
            
            <div className="space-y-6">
              {/* Previous Diagnosed Conditions */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Previous Diagnosed Conditions</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium border border-blue-100">Seasonal Allergies (2020)</span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium border border-blue-100">Sprained Ankle (2018)</span>
                </div>
              </div>

              {/* Past Surgeries */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Past Surgeries</label>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-700 text-sm">Appendectomy</p>
                    <p className="text-xs text-gray-500 mt-1">Year: 2015</p>
                  </div>
                </div>
              </div>

              {/* Childhood Illness */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Childhood Illness</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium border border-purple-100">Chickenpox</span>
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium border border-purple-100">Measles</span>
                </div>
              </div>

              {/* Long Term Treatments */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Long Term Treatments</label>
                <span className="text-gray-400 text-sm italic">No long-term treatments</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FAMILY MEDICAL HISTORY */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 mb-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2 bg-green-50 rounded-lg text-green-600"><Users className="w-5 h-5" /></div>
            <h3 className="font-bold text-gray-800">Family Medical History</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Check if familyHistory exists in userData */}
            {displayUser.familyHistory && displayUser.familyHistory.length > 0 ? (
              displayUser.familyHistory.map((member: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{member.relation || 'Family Member'}</p>
                      {member.age && <p className="text-xs text-gray-500">Age {member.age}</p>}
                      {member.deceased && <p className="text-xs text-gray-400 italic">(Deceased)</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {/* Handle both 'conditions' and 'disease' properties */}
                    {(member.conditions && member.conditions.length > 0) || member.disease ? (
                      <>
                        {member.conditions && member.conditions.map((condition: string, i: number) => (
                          <span key={i} className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">
                            {condition}
                          </span>
                        ))}
                        {member.disease && !member.conditions && (
                          <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">
                            {member.disease}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs italic">No known conditions</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // MOCK DATA when no family history is available
              <>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Father</p>
                      <p className="text-xs text-gray-500">Age 65</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100 mr-1">Hypertension</span>
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100 mr-1">Diabetes Type 2</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Mother</p>
                      <p className="text-xs text-gray-500">Age 62</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">Thyroid Disorder</span>
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100 ml-1">Osteoporosis</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Grandfather (Paternal)</p>
                      <p className="text-xs text-gray-400 italic">(Deceased)</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100 mr-1">Heart Disease</span>
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100 mr-1">Stroke</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Grandmother (Maternal)</p>
                      <p className="text-xs text-gray-400 italic">(Deceased)</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">Alzheimer's Disease</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Uncle (Paternal)</p>
                      <p className="text-xs text-gray-500">Age 58</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-100">Cancer (Colon)</span>
                    <span className="inline-block px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium border border-green-100 ml-1">Recovered</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Sibling</p>
                      <p className="text-xs text-gray-500">Age 28</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-400 text-xs italic">No known conditions</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </main>

      {/* Edit Form Modal */}
      {showEditForm && (
        <MedicalInfoForm
          initialData={userData}
          onComplete={handleFormSubmit}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}