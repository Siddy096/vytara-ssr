import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Appointment } from '../App';

type Props = {
  appointments: Appointment[];
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
};

export function AppointmentsModal({ appointments, onClose, onAddAppointment, onDeleteAppointment }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    type: '',
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDayDate(dateStr);
    setEventForm({
      title: '',
      date: dateStr,
      time: '',
      type: '',
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    setSelectedEvent(appointment);
    setEventForm({
      title: appointment.title,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
    });
    setSelectedDayDate(appointment.date);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventForm.title && eventForm.date && eventForm.time && eventForm.type) {
      onAddAppointment({
        id: selectedEvent?.id || Date.now().toString(),
        ...eventForm,
      });
      setShowEventModal(false);
      setEventForm({ title: '', date: '', time: '', type: '' });
      setSelectedEvent(null);
    }
  };

  const handleCancelEvent = () => {
    if (selectedEvent) {
      onDeleteAppointment(selectedEvent.id);
      setShowEventModal(false);
      setSelectedEvent(null);
      setEventForm({ title: '', date: '', time: '', type: '' });
    }
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const isPastDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#309898]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#309898]/20 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-[#309898]">Upcoming Appointments</h2>
          <button onClick={onClose} className="text-[#FF8000] hover:text-[#309898] transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-[#309898]/10 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6 text-[#309898]" />
            </button>
            <h3 className="text-[#FF8000]">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-[#FF8000]/10 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6 text-[#FF8000]" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[#309898] p-2 font-semibold">
                {day}
              </div>
            ))}
            
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayAppointments = getAppointmentsForDate(day);
              const past = isPastDate(day);
              
              return (
                <div
                  key={`day-${day}`}
                  className={`p-2 border-2 rounded-lg min-h-[80px] cursor-pointer transition ${
                    past
                      ? 'bg-gray-100 border-gray-300'
                      : dayAppointments.length > 0
                      ? 'bg-[#FF8000]/10 border-[#FF8000] hover:bg-[#FF8000]/20'
                      : 'border-[#309898]/30 hover:bg-[#309898]/10'
                  }`}
                  onClick={() => {
                    if (!past) {
                      handleDateClick(day);
                    }
                  }}
                >
                  <div className={`text-sm font-semibold ${past ? 'text-gray-500' : 'text-[#309898]'}`}>
                    {day}
                  </div>
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      onClick={(e) => handleEventClick(e, apt)}
                      className="text-xs bg-[#309898] text-white rounded px-1 py-0.5 mt-1 truncate hover:bg-[#FF8000] transition"
                      title={`${apt.title} at ${apt.time}`}
                    >
                      {apt.time} - {apt.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-[#FF8000]">
            <div className="p-6 border-b-2 border-[#FF8000]/20 flex justify-between items-center">
              <h3 className="text-[#FF8000]">{selectedEvent ? 'Edit Event' : 'Add Event'}</h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                  setEventForm({ title: '', date: '', time: '', type: '' });
                }}
                className="text-[#309898] hover:text-[#FF8000] transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-[#309898] mb-2">Event Name</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., Doctor Visit"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none bg-gray-50"
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Event Time</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Type</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Doctor Visit">Doctor Visit</option>
                  <option value="Lab Test">Lab Test</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition"
                >
                  {selectedEvent ? 'Update Event' : 'Add Event'}
                </button>
                {selectedEvent && eventForm.title && (
                  <button
                    type="button"
                    onClick={handleCancelEvent}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
