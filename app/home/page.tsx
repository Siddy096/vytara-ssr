"use client";

import { useState } from 'react';
import { HomePage } from '@/components/HomePage';
import { UserData, Appointment } from '@/lib/types';

export default function HomePageWrapper() {
  const [userData, setUserData] = useState<UserData>({
    personalInfo: {
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      bloodType: 'O+',
      allergies: ['Peanuts'],
      emergencyContacts: [
        { name: 'Jane Doe', phone: '123-456-7890', relation: 'Spouse' },
        { name: 'Dr. Smith', phone: '098-765-4321', relation: 'Doctor' }
      ]
    },
    currentMedical: {
      conditions: ['Hypertension'],
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' }
      ],
      doctors: [
        { name: 'Dr. Smith', phone: '098-765-4321', speciality: 'Cardiology' },
        { name: 'Dr. Johnson', phone: '111-222-3333', speciality: 'General Practice' }
      ]
    },
    medicalHistory: {
      surgeries: ['Appendectomy'],
      hospitalizations: ['Heart surgery in 2020']
    },
    insurance: {
      provider: 'Health Insurance Co.',
      policyNumber: '123456789',
      groupNumber: '987654321'
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '10:00',
      title: 'Cardiology Checkup',
      type: 'consultation'
    },
    {
      id: '2',
      date: '2024-01-20',
      time: '14:00',
      title: 'Blood Test',
      type: 'test/scan'
    }
  ]);

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleUpdateEmergencyContacts = (contacts: { name: string; phone: string; relation: string }[]) => {
    setUserData({
      ...userData,
      personalInfo: {
        ...userData.personalInfo,
        emergencyContacts: contacts
      }
    });
  };

  return (
    <HomePage
      userData={userData}
      onNavigateToVault={() => {}}
      onNavigateToProfile={() => {}}
      appointments={appointments}
      onAddAppointment={handleAddAppointment}
      onDeleteAppointment={handleDeleteAppointment}
      onUpdateEmergencyContacts={handleUpdateEmergencyContacts}
      insurancePolicies={[]}
      documents={[]}
    />
  );
}
