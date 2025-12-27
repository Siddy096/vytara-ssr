import { useState } from 'react';
import {
  Calendar, Users, Stethoscope, Pill, Activity, Building2, Shield,
  AlertCircle, Sparkles, X, Phone, Clock, Star, ChevronRight, FileText, Edit, Trash2,
  ChevronLeft, Menu
} from 'lucide-react';
import logoImage from '../assets/vytara logo.png';
import { MedicalInfoForm } from './MedicalInfoForm';
import { UserData, Appointment } from '../App';

type Props = {
  userData: UserData;
  onNavigateToVault: () => void;
  onNavigateToProfile: () => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  insurancePolicies: any[];
  onUpdateEmergencyContacts: (contacts: { name: string; phone: string; relation: string }[]) => void;
  documents: any[];
};

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function HomePage({
  userData,
  onNavigateToVault,
  onNavigateToProfile,
  appointments,
  onAddAppointment,
  onDeleteAppointment,
  onUpdateEmergencyContacts
}: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [medicalFormSection, setMedicalFormSection] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeSummaryModal = () => {
    setShowSummaryModal(false);
    // optional: clear state if you want fresh every time
    // setSummaryText('');
    // setRecentDocs([]);
  };
  const handleGetSummary = () => {
    try {
      // 1. Define Unique Mock Data (Renamed to avoid conflicts)
      const demoDocs = [
        { id: '101', name: 'Blood Test Report.pdf', uploadDate: '2024-01-15' },
        { id: '102', name: 'X-Ray Results.pdf', uploadDate: '2024-02-20' },
        { id: '103', name: 'Prescription.pdf', uploadDate: '2024-03-10' },
      ];

      // 2. Set the Recent Docs state directly with this data
      setRecentDocs(demoDocs);

      // 3. Generate Summary Text
      // We check if 'summaryText' already has content to simulate "learning"
      if (summaryText && !summaryText.includes("Baseline")) {
        
        // --- PROGRESSIVE UPDATE ---
        const newSummary = 
          `📊 **PROGRESSIVE ANALYSIS REPORT**\n` +
          `--------------------------------------------\n\n` +
          
          `**PREVIOUS CONTEXT:**\n` +
          `• Patient history indicates stable vitals.\n` +
          `• Minor iron deficiencies noted in earlier reports.\n\n` +
          
          `**NEW DATA ANALYSIS (${demoDocs.length} files):**\n` +
          `${demoDocs.map(doc => `• ${doc.name}: Indicators within normal range`).join('\n')}\n\n` +
          
          `**INTEGRATED CONCLUSION:**\n` +
          `Comparing recent uploads with previous baselines shows a positive trend. No significant deviations from the established medical history.\n\n` + 

          `**RECOMMENDATION:**\n` +
          `• Continue current medication protocol.\n` +
          `• Schedule follow-up in 3 months.`;
        
        setSummaryText(newSummary);

      } else {
        
        // --- BASELINE SUMMARY ---
        const initialSummary = 
          `📋 **BASELINE MEDICAL SUMMARY**\n` +
          `--------------------------------------------\n\n` +
          
          `**ANALYZED DOCUMENTS:**\n` +
          `${demoDocs.map(doc => `• ${doc.name}`).join('\n')}\n\n` +
          
          `**KEY FINDINGS:**\n` +
          `• Blood levels are consistent with healthy benchmarks.\n` +
          `• No critical allergies detected.\n` +
          `• Interaction risks: None in current set.\n\n` +
          
          `**RECOMMENDATION:**\n` +
          `Establishing this as the baseline for future comparisons. System will monitor for changes against these values in future uploads.`;
        
        setSummaryText(initialSummary);
      }

      // 4. Open the modal
      setShowSummaryModal(true);
      
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Something went wrong. Please check the console.");
    }
  };

  const handleSOSClick = () => {
    alert('🚨 SOS Alert! Emergency contacts will be notified immediately.');
  };

  const handleEditEmergency = () => {
    setMedicalFormSection(1);
    setShowMedicalForm(true);
  };

  const handleEditDoctors = () => {
    setMedicalFormSection(2);
    setShowMedicalForm(true);
  };

  const handleEditMedications = () => {
    setMedicalFormSection(2);
    setShowMedicalForm(true);
  };

  const handleDeleteEmergency = (index: number) => {
    const updatedContacts = [...userData.personalInfo.emergencyContacts];
    updatedContacts.splice(index, 1);
    onUpdateEmergencyContacts(updatedContacts);
  };

  const cards = [
    { id: 'appointments', title: 'Upcoming Appointments', icon: Calendar, color: '#006770' },
    { id: 'emergency', title: 'Emergency Contacts', icon: Users, color: '#00838B' },
    { id: 'doctors', title: 'Medical Team', icon: Stethoscope, color: '#006770' },
    { id: 'medications', title: 'Current Medication', icon: Pill, color: '#00838B' },
  ];

  const renderModalContent = () => {
    switch (activeModal) {
      case 'appointments':
        return <CalendarView
          appointments={appointments}
          onAddAppointment={onAddAppointment}
          onDeleteAppointment={onDeleteAppointment}
        />;
      case 'emergency':
        return <EmergencyContactsView
          data={userData.personalInfo.emergencyContacts}
          onEdit={handleEditEmergency}
          onDelete={handleDeleteEmergency}
        />;
      case 'doctors':
        return <DoctorsView
          data={userData.currentMedical.doctors}
          onEdit={handleEditDoctors}
        />;
      case 'medications':
        return <MedicationsView
          data={userData.currentMedical.medications}
          onEdit={handleEditMedications}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003B46] via-[#006770] via-[#00838B] to-[#00A3A9] pb-10 font-sans">
      
      {/* Header */}
      <header 
        className="sticky top-0 z-40 border-b border-white/20 shadow-sm"
        style={{ background: 'linear-gradient(90deg, #006770 0%, #00838B 40%, #00A3A9 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md p-2">
                <img 
                  src={logoImage} 
                  alt="Vytara Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="hidden sm:block text-xl font-bold text-white tracking-wide">Vytara</h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              
              {/* Get Summary Button - FIXED COLOR */}
              <button
                onClick={handleGetSummary}
                // UPDATED: Used standard 'bg-purple-600' instead of hex code to ensure it works.
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-lg font-semibold text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed border border-purple-400/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Summary</span>
              </button>

              {/* Mobile Menu Button (Hamburger) */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg flex items-center justify-center transition border border-white/30 bg-white/10 backdrop-blur-sm"
                >
                  {isMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <button
                      onClick={() => { onNavigateToVault(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#006770] flex items-center gap-3 transition"
                    >
                      <Shield className="w-4 h-4" /> Vault
                    </button>
                    <button
                      onClick={() => { onNavigateToProfile(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#006770] flex items-center gap-3 transition"
                    >
                      <Users className="w-4 h-4" /> Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SOS Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSOSClick}
            className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full shadow-2xl flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200"
          >
            <AlertCircle className="w-10 h-10 sm:w-14 sm:h-14 mb-1" />
            <span className="text-lg sm:text-2xl font-bold">SOS</span>
          </button>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setActiveModal(card.id)}
              >
                <div 
                  className="bg-white rounded-3xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all" 
                  style={{ borderColor: card.color }}
                >
                  {/* Icon Background - Now Soft Orange */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: 'rgba(255, 127, 80, 0.2)' }}
                  >
                    <Icon className="w-8 h-8" style={{ color: card.color }} />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 text-sm sm:text-base">
                    {card.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </main> 
      {/* ^^^ MAKE SURE THIS </main> TAG EXISTS */}

      {/* Content Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 bg-gray-100 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-200">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">AI Medical Summary</h2>
              </div>
              <button
                onClick={closeSummaryModal}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Analyzed Documents ({recentDocs.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentDocs.map(doc => (
                    <span key={doc.id} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-semibold">
                      {doc.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* FIXED: 'whitespace-pre-wrap' forces the new lines to appear. 'leading-loose' adds space. */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-gray-700 whitespace-pre-wrap break-words font-sans text-base leading-loose">
                  {summaryText || '🤖 AI is processing your documents...'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-lg text-sm sm:text-base"
                onClick={() => alert("Downloading Summary PDF...")}
              >
                <FileText className="w-5 h-5" /> 
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Info Form Modal */}
      {showMedicalForm && (
        <MedicalInfoForm
          onComplete={(data) => {
            console.log('Medical data updated:', data);
            setShowMedicalForm(false);
          }}
          onClose={() => setShowMedicalForm(false)}
          initialSection={medicalFormSection}
        />
      )}
    </div>
  );
}

// Calendar View Component
function CalendarView({ appointments, onAddAppointment, onDeleteAppointment }: {
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}) {
  const handleEditAppointment = (updatedAppointment: Appointment) => {
    onDeleteAppointment(updatedAppointment.id);
    onAddAppointment(updatedAppointment);
  };
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    while (days.length < 42) {
      days.push(null);
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const key = formatDateKey(date);
    return appointments.filter(apt => apt.date === key);
  };

  const handleDateClick = (date: Date, event?: Appointment) => {
    setSelectedDate(date);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetailsModal(true);
    } else {
      setShowAddEventModal(true);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-100 rounded-xl">
          <Calendar className="w-8 h-8 text-teal-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-[#006770] text-white rounded-lg hover:bg-[#006770]/80 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-lg font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>

        <button
          onClick={handleNextMonth}
          className="p-2 bg-[#006770] text-white rounded-lg hover:bg-[#006770]/80 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100 mb-6">
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-xs sm:text-sm font-bold text-gray-400 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-16 sm:h-20"></div>;
            }

            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={
                  `h-16 sm:h-20 flex flex-col items-center justify-start text-sm rounded-lg relative cursor-pointer 
                   transition-all p-1 bg-white text-gray-700 border border-gray-100 hover:bg-teal-50
                   ${isToday ? 'ring-2 ring-[#006770] font-bold' : ''}
                   ${isSelected && !isToday ? 'ring-2 ring-teal-300' : ''}`
                }
              >
                <span className="font-semibold text-xs sm:text-sm">{date.getDate()}</span>
                {dayAppointments.length > 0 && (
                  <div className="flex flex-col items-stretch mt-1 w-full gap-1">
                    {dayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .slice(0, 2)
                      .map((appt) => (
                        <div
                          key={appt.id}
                          className="text-[8px] sm:text-[9px] leading-snug text-left truncate w-full
                                     bg-[#006770] text-white rounded px-1 py-px
                                     cursor-pointer hover:bg-[#00838B]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateClick(date, appt);
                          }}
                        >
                          {appt.title.length > 8 ? `${appt.title.substring(0, 8)}…` : appt.title}
                        </div>
                      ))}
                    {dayAppointments.length > 2 && (
                      <span className="text-[8px] sm:text-[9px] text-[#006770] font-semibold">
                        +{dayAppointments.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">All Appointments</h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {appointments
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) {
              return dateA - dateB;
            }
            return a.time.localeCompare(b.time);
          })
          .map((appt) => (
            <div
              key={appt.id}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-teal-50 transition cursor-pointer group"
              onClick={() => {
                setSelectedEvent(appt);
                setShowEventDetailsModal(true);
              }}
            >
              <div className="flex flex-col items-center bg-teal-100 text-teal-800 px-3 py-1 rounded-lg min-w-[60px]">
                <span className="text-xs font-bold uppercase">
                  {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-lg font-bold">{new Date(appt.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{appt.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {appt.time}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-600" />
            </div>
          ))}
        {appointments.length === 0 && (
          <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
        )}
      </div>

      {showAddEventModal && selectedDate && (
        <AddEventModal
          selectedDate={selectedDate}
          onClose={() => setShowAddEventModal(false)}
          onAdd={onAddAppointment}
        />
      )}
      {showEventDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowEventDetailsModal(false)}
          onEdit={handleEditAppointment}
          onDelete={onDeleteAppointment}
        />
      )}
    </div>
  );
}

function AddEventModal({ selectedDate, onClose, onAdd }: {
  selectedDate: Date;
  onClose: () => void;
  onAdd: (appointment: Appointment) => void;
}) {
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState<'consultation' | 'follow-up' | 'test/scan' | 'procedure' | 'other'>('consultation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim() && eventTime) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date: formatDateKey(selectedDate),
        time: eventTime,
        title: eventName,
        type: eventType,
      };
      onAdd(newAppointment);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#006770] mb-2 font-medium">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-[#006770] mb-2 font-medium">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none bg-white"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="test/scan">Test / Scan</option>
              <option value="procedure">Procedure</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[#006770] mb-2 font-medium">Date</label>
            <input
              type="date"
              value={formatDateKey(selectedDate)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-[#006770] mb-2 font-medium">Time</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition font-semibold"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}

function EventDetailsModal({ event, onClose, onEdit, onDelete }: {
  event: Appointment;
  onClose: () => void;
  onEdit: (updatedEvent: Appointment) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(event.title);
  const [editTime, setEditTime] = useState(event.time);
  const [editType, setEditType] = useState(event.type || 'consultation');

  const handleSaveEdit = () => {
    const updatedEvent: Appointment = {
      ...event,
      title: editName,
      time: editTime,
      type: editType
    };
    onEdit(updatedEvent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  const prettyType = event.type
    ? event.type
        .replace('/', ' / ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Not specified';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isEditing ? 'Edit Event' : 'Event Details'}
        </h2>

        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label className="block text-[#006770] mb-2 font-medium">Event Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Event Type</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none bg-white"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="test/scan">Test / Scan</option>
                <option value="procedure">Procedure</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Date</label>
              <input
                type="date"
                value={event.date}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Time</label>
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#006770] focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition font-semibold"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[#006770] mb-2 font-medium">Event Name</label>
              <p className="text-gray-800 font-semibold">{event.title}</p>
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Event Type</label>
              <p className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#006770]/10 text-[#006770]">
                {prettyType}
              </p>
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Date</label>
              <p className="text-gray-800">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-[#006770] mb-2 font-medium">Time</label>
              <p className="text-gray-800">{event.time}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition font-semibold"
              >
                Edit Event
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Delete Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmergencyContactsView({ data, onEdit, onDelete }: {
  data: { name: string; phone: string; relation: string }[];
  onEdit: () => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-xl">
          <Phone className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((contact, index) => (
          <div key={index} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-white flex items-center justify-between group">
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.relation} • {contact.phone}</p>
            </div>
            <button
              onClick={() => onDelete(index)}
              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">No emergency contacts added</p>
        )}
      </div>
    </div>
  );
}

function DoctorsView({ data, onEdit }: {
  data: { name: string; phone: string; speciality: string }[];
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-100 rounded-xl">
          <Stethoscope className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Medical Team</h2>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((doctor, index) => (
          <div key={index} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.speciality}</p>
                <p className="text-sm text-blue-600">{doctor.phone}</p>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">No doctors added</p>
        )}
      </div>
    </div>
  );
}

function MedicationsView({ data, onEdit }: {
  data: { name: string; dosage: string; frequency: string }[];
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Pill className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Current Medications</h2>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#006770] text-white rounded-lg hover:bg-[#00838B] transition"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((med, index) => (
          <div key={index} className="p-4 border border-gray-100 rounded-xl bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{med.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dosage</p>
                <p className="font-semibold text-gray-900">{med.dosage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Frequency</p>
                <p className="font-semibold text-gray-900">{med.frequency}</p>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">No medications added</p>
        )}
      </div>
    </div>
  );
}
