'use client'

import {
  User, Phone, Activity, Edit2,
  Download, Droplet, Calculator, CalendarCheck,
  ChevronDown, Users, Menu, X, Pill, History, LogOut, Calendar, Locate, Plus
} from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Silk from '@/components/Silk';
import jsPDF from 'jspdf';

export default function ProfilePageUI() {

  const router = useRouter();
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isCurrentMedicalModalOpen, setIsCurrentMedicalModalOpen] = useState(false);
  const [isPastMedicalModalOpen, setIsPastMedicalModalOpen] = useState(false);
  const [isFamilyHistoryModalOpen, setIsFamilyHistoryModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function getUser(){
      const { data } = await supabase.auth.getUser();
      if(data.user){
        setUserId(data.user.id)
        setPhoneNumber(data.user.phone ?? "")
      }
    }
    getUser();
  }, [])

  {/* PERSONAL DATA */}
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");
  const [personalDraft, setPersonalDraft] = useState({
    userName: "",
    gender: "",
    dob: "",
    phoneNumber: "",
    bloodGroup: "",
    address: "",
  });

  {/* MEDICAL DATA */}
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<string[]>([]);
  const [treatment, setTreatment] = useState<string[]>([]);

  type Medication = {
    name: string,
    dosage: string,
    frequency: string
  }

  const [currentMedications, setCurrentMedications] = useState<Medication[]>([]);

  {/* PAST MEDICAL HISTORY */}

  const [previousDiagnosedCondition, setPreviousDiagnosedCondition] = useState<string[]>([]);
  const [childhoodIllness, setChildhoodIllness] = useState<string[]>([]);
  const [longTermTreatments, setLongTermTreatments] = useState<string[]>([]);

  type PastSurgery = {
    name: string,
    month: number | null,
    year: number | null
  }

  const [pastSurgeries, setPastSurgeries] = useState<PastSurgery[]>([]);

  type FamilyMedicalHistory = {
    disease: string,
    relation: string,
  }

  const [familyMedicalHistory, setFamilyMedicalHistory] = useState<FamilyMedicalHistory[]>([]);

  const currentYear = new Date().getFullYear();
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, idx) => currentYear - idx);

  const formatMonthYear = (month: number | null, year: number | null) => {
    if (!month || !year) return "Date not set";
    const label = monthOptions.find((opt) => opt.value === month)?.label ?? String(month);
    return `${label} ${year}`;
  };

  const openPersonalInfoModal = () => {
    setPersonalDraft({
      userName,
      gender,
      dob,
      phoneNumber,
      bloodGroup,
      address,
    });
    setIsPersonalInfoModalOpen(true);
  };

  const updatePersonalDraft = (patch: Partial<typeof personalDraft>) => {
    setPersonalDraft((prev) => ({ ...prev, ...patch }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Medical Information Report', 20, 30);

    // Personal Information
    doc.setFontSize(16);
    doc.text('Personal Information', 20, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 20, 65);
    doc.text(`Gender: ${gender}`, 20, 75);
    doc.text(`Date of Birth: ${dob}`, 20, 85);
    doc.text(`Phone: ${phoneNumber}`, 20, 95);
    doc.text(`Blood Group: ${bloodGroup}`, 20, 105);
    doc.text(`Address: ${address}`, 20, 115);
    doc.text(`BMI: ${bmi}`, 20, 125);
    doc.text(`Age: ${age}`, 20, 135);

    let yPosition = 155;

    // Current Medical Status
    doc.setFontSize(16);
    doc.text('Current Medical Status', 20, yPosition);
    yPosition += 15;
    doc.setFontSize(12);

    if (conditions.length > 0) {
      doc.text('Current Diagnosed Conditions:', 20, yPosition);
      yPosition += 10;
      conditions.forEach(condition => {
        doc.text(`- ${condition}`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (allergy.length > 0) {
      doc.text('Allergies:', 20, yPosition);
      yPosition += 10;
      allergy.forEach(allergyItem => {
        doc.text(`- ${allergyItem}`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (treatment.length > 0) {
      doc.text('Ongoing Treatments:', 20, yPosition);
      yPosition += 10;
      treatment.forEach(treat => {
        doc.text(`- ${treat}`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (currentMedications.length > 0) {
      doc.text('Current Medications:', 20, yPosition);
      yPosition += 10;
      currentMedications.forEach(med => {
        doc.text(`- ${med.name} (${med.dosage}, ${med.frequency})`, 30, yPosition);
        yPosition += 10;
      });
    }

    // Past Medical History
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.text('Past Medical History', 20, yPosition);
    yPosition += 15;
    doc.setFontSize(12);

    if (previousDiagnosedCondition.length > 0) {
      doc.text('Previous Diagnosed Conditions:', 20, yPosition);
      yPosition += 10;
      previousDiagnosedCondition.forEach(condition => {
        doc.text(`- ${condition}`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (pastSurgeries.length > 0) {
      doc.text('Past Surgeries:', 20, yPosition);
      yPosition += 10;
      pastSurgeries.forEach(surgery => {
        doc.text(`- ${surgery.name} (${formatMonthYear(surgery.month, surgery.year)})`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (childhoodIllness.length > 0) {
      doc.text('Childhood Illnesses:', 20, yPosition);
      yPosition += 10;
      childhoodIllness.forEach(illness => {
        doc.text(`- ${illness}`, 30, yPosition);
        yPosition += 10;
      });
    }

    if (longTermTreatments.length > 0) {
      doc.text('Long Term Treatments:', 20, yPosition);
      yPosition += 10;
      longTermTreatments.forEach(treatment => {
        doc.text(`- ${treatment}`, 30, yPosition);
        yPosition += 10;
      });
    }

    // Family Medical History
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.text('Family Medical History', 20, yPosition);
    yPosition += 15;
    doc.setFontSize(12);

    if (familyMedicalHistory.length > 0) {
      familyMedicalHistory.forEach(history => {
        doc.text(`${history.relation}: ${history.disease}`, 20, yPosition);
        yPosition += 10;
      });
    }

    // Save the PDF
    doc.save('medical-information.pdf');
  };

  useEffect(() => {
    async function fetchPersonalData(){
      if (!userId) return;
      const { data, error } = await supabase
        .from("personal")
        .select("display_name, phone, gender, address")
        .eq("id", userId)
        .maybeSingle();

      if (error){
        console.log("Error: ", error);
        return;
      }

      if (data){
        if (data.display_name) {
          setUserName(data.display_name);
        }
        setPhoneNumber((prev) => data.phone || prev || "");
        setGender((prev) => data.gender || prev || "");
        setAddress((prev) => data.address || prev || "");
      }
    }
    fetchPersonalData();
  }, [userId]);



  useEffect(() => {
    async function fetchHealthData(){
      if (!userId) return;
      const { data, error } = await supabase
        .from("health")
        .select(`
          date_of_birth,
          blood_group,
          current_diagnosed_condition,
          allergies,
          ongoing_treatments,
          current_medication,
          bmi,
          age,
          previous_diagnosed_conditions,
          past_surgeries,
          childhood_illness,
          long_term_treatments
        `)
        .eq("user_id", userId)
        .maybeSingle();

      if (error){
        console.log("Error: ", error);
        return;
      }

      if (data){
        setConditions((data.current_diagnosed_condition as string[]) || []);
        setAllergy((data.allergies as string[]) || []);
        setTreatment((data.ongoing_treatments as string[]) || []);
        setCurrentMedications((data.current_medication as Medication[]) || []);
        setBmi(data.bmi !== null && data.bmi !== undefined ? String(data.bmi) : "");
        setAge(data.age !== null && data.age !== undefined ? String(data.age) : "");
        setBloodGroup(data.blood_group || "");
        setDob(data.date_of_birth || "");

        setPreviousDiagnosedCondition((data.previous_diagnosed_conditions as string[]) || []);
        setPastSurgeries((data.past_surgeries as PastSurgery[]) || []);
        setChildhoodIllness((data.childhood_illness as string[]) || []);
        setLongTermTreatments((data.long_term_treatments as string[]) || []);
      }
    }
    fetchHealthData();
  }, [userId]);

  useEffect(() => {
    async function fetchFamilyHealthData() {
      const { data, error } = await supabase
        .from("personal")
        .select("family_history")
        .eq("id", userId)
        .maybeSingle();

      if ( error ) {
        console.log("Error: ", error)
      }

      if (data && data.family_history) {
        setFamilyMedicalHistory(data.family_history.familyMedicalHistory || []);
      }
    }
    fetchFamilyHealthData();
  }, [userId]);

  return (
    <div className="min-h-screen pb-10 font-sans relative">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Silk
          speed={5}
          scale={1}
          color="#2abec0"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Silk
          speed={5}
          scale={1}
          color="#2abec0"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Navbar */}


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">

          {/* Left: Basic Info & KPIs */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 flex flex-col h-full relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-teal-50 to-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80 pointer-events-none"></div>

            {/* Edit and Export Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-teal-50 backdrop-blur text-teal-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg border border-teal-200 shadow-sm transition text-sm font-medium"
              >
                Export as PDF
              </button>
              <button
                onClick={openPersonalInfoModal}
                className="p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-[#FF8000] hover:bg-orange-50 rounded-full border border-gray-200 shadow-sm transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8 mt-2 relative z-0">
              {/* Switch Profile Button & Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur hover:bg-white text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider transition border border-gray-200 shadow-sm">
                    <Users className="w-3 h-3 text-teal-600" />
                    <span>Switch Profile</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center border-[4px] border-white shadow-lg shrink-0">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-teal-700/80" />
                </div>
              </div>

              <div className="flex-1 w-full pt-2">
                <div className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">{userName}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-full border border-blue-200">
                      {gender}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span>{phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <span>{dob}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 group hover:text-teal-600 transition">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
                      <Locate className="w-3 h-3" />
                    </div>
                    <span className='break-words whitespace-normal'>{address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* KPI 1 */}
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 hover:border-red-300 transition shadow-sm group">
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Droplet className="w-3 h-3 fill-red-400 text-red-400 group-hover:scale-110 transition" /> Blood
                </p>
                <p className="text-2xl font-bold text-gray-800">{bloodGroup}</p>
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
                  <CalendarCheck className="w-3 h-3 text-purple-500 group-hover:scale-110 transition" /> Age
                </p>
                <p className="text-2xl font-bold text-gray-800">{age || "—"}</p>
              </div>
            </div>
          </div>

          {/* Right: Historical Visits */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <History className="w-4 h-4" />
                </div>
                Historical Visits
              </h3>

              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition">
                View All
              </button>
            </div>

            {/* EMPTY STATE */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400 italic">
                No historical visits
              </p>
            </div>
          </div>

        </div>

        {/* Medical Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Current Medical Status */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-800">Current Medical Status</h3>
              <button
                onClick={() => setIsCurrentMedicalModalOpen(true)}
                className="p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-[#FF8000] hover:bg-orange-50 rounded-full border border-gray-200 shadow-sm transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Current Diagnosed Conditions */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Current Diagnosed Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {conditions.length > 0 ? (
                    conditions.map((condition, index) => (
                      <span
                        key={index}
                        className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                      >
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No conditions added</span>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Allergies</label>
                <div className="flex flex-wrap gap-2">
                    {allergy.length > 0 ? (
                      allergy.map((allergy, index) => (
                        <span
                          key={index}
                          className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-400 text-sm'>No Allergies Added</span>
                    )}
                </div>
              </div>

              {/* Ongoing Treatments */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Ongoing Treatments</label>
                  <div className="flex flex-wrap gap-2">
                    {treatment.length > 0 ? (
                      treatment.map((treatment, index) => (
                        <span
                          key={index}
                          className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                        >
                          {treatment}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-400 text-sm'>No Treatments Currently</span>
                    )}
                  </div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Current Medication</label>
                {currentMedications.map((current, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100'
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Pill className="w-4 h-4" />
                      </div>

                      <div>
                        <p className="font-bold text-gray-700">{current.name}</p>
                        <p className="text-xs text-gray-500">Dosage: {current.dosage || "Not specified"}</p>
                        <p className="text-xs text-gray-500">Frequency: {current.frequency || "Not specified"}</p>
                      </div>
                    </div>

                    <span className='text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100'>
                      {current.frequency || "As directed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Medical History */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-800">Past Medical History</h3>
              <button
                onClick={() => setIsPastMedicalModalOpen(true)}
                className="p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-[#FF8000] hover:bg-orange-50 rounded-full border border-gray-200 shadow-sm transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Previous Diagnosed Conditions */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Previous Diagnosed Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {previousDiagnosedCondition.length > 0 ? (
                    previousDiagnosedCondition.map((previousDiagnosedCondition, index) => (
                      <span
                        key={index}
                        className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                      >
                        {previousDiagnosedCondition}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 text-sm'>No Previous Conditions Added</span>
                  )}
                </div>
              </div>

              {/* Past Surgeries */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Past Surgeries</label>
                <div className="space-y-2">
                  {pastSurgeries.map((pastSurgeries, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100'
                    >
                      <div className="flex items-center gap-3">
                        {/* <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        </div> */}

                        <div>
                          <p className="font-bold text-gray-700">{pastSurgeries.name}</p>
                          <p className="text-xs text-gray-500">Date: {formatMonthYear(pastSurgeries.month, pastSurgeries.year)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Childhood Illness */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Childhood Illness</label>
                <div className="flex flex-wrap gap-2">
                  {childhoodIllness.length > 0 ? (
                    childhoodIllness.map((childhoodIllness, index) => (
                      <span
                        key={index}
                        className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                      >
                        {childhoodIllness}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 text-sm'>No ChildHoodIllnesses Added</span>
                  )}
                </div>
              </div>

              {/* Long Term Treatments */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 block">Long Term Treatments</label>
                  {longTermTreatments.length > 0 ? (
                    longTermTreatments.map((longTermTreatments, index) => (
                      <span
                        key={index}
                        className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100'
                      >
                        {longTermTreatments}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 text-sm'>No Long Term Treatments Added</span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Family Medical History */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/20 border border-white/20 mb-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Family Medical History</h3>
            <button
              onClick={() => setIsFamilyHistoryModalOpen(true)}
              className="p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-[#FF8000] hover:bg-orange-50 rounded-full border border-gray-200 shadow-sm transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-300 transition">
            <div className="space-y-2">
              {familyMedicalHistory.map((familyMedicalHistory, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100'
                >
                  <div className="flex items-center gap-3">
                    {/* <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    </div> */}
                      <p className="font-bold text-gray-700">{familyMedicalHistory.relation}</p>
                      <p className="text-xs text-gray-500">Disease: {familyMedicalHistory.disease}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Personal Info Modal */}
        {isPersonalInfoModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Edit Personal Information</h3>
                <button
                  onClick={() => setIsPersonalInfoModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const personalData = {
                    display_name: personalDraft.userName,
                    phone: personalDraft.phoneNumber,
                    gender: personalDraft.gender,
                    address: personalDraft.address,
                  };
                  const { error: personalError } = await supabase
                    .from("personal")
                    .update(personalData)
                    .eq("id", userId);
                  const { error: healthError } = await supabase
                    .from("health")
                    .update({
                      date_of_birth: personalDraft.dob,
                      blood_group: personalDraft.bloodGroup,
                    })
                    .eq("user_id", userId);
                  if (personalError) {
                    alert("Error: " + personalError.message);
                  } else if (healthError) {
                    alert("Error: " + healthError.message);
                  } else {
                    setUserName(personalDraft.userName);
                    setGender(personalDraft.gender);
                    setDob(personalDraft.dob);
                    setPhoneNumber(personalDraft.phoneNumber);
                    setBloodGroup(personalDraft.bloodGroup);
                    setAddress(personalDraft.address);
                    setIsPersonalInfoModalOpen(false);
                    alert("Personal information updated successfully!");
                  }
                }}>
                  <div className="space-y-4">
                    <h3 className="text-[#FF8000] mb-4">Basic Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[#309898] mb-2">Full Name *</label>
                        <input
                          value={personalDraft.userName}
                          onChange={(e) => updatePersonalDraft({ userName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                          placeholder="Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-[#309898] mb-2">Date of Birth *</label>
                        <input
                          type="date"
                          value={personalDraft.dob}
                          onChange={(e) => updatePersonalDraft({ dob: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[#309898] mb-2">Gender *</label>
                        <select
                          value={personalDraft.gender}
                          onChange={(e) => updatePersonalDraft({ gender: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                        >
                          <option>Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#309898] mb-2">Blood Group *</label>
                        <select
                          value={personalDraft.bloodGroup}
                          onChange={(e) => updatePersonalDraft({ bloodGroup: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                        >
                          <option>Select Blood Group</option>
                          <option>A+</option>
                          <option>A−</option>
                          <option>B+</option>
                          <option>B−</option>
                          <option>AB+</option>
                          <option>AB−</option>
                          <option>O+</option>
                          <option>O−</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[#309898] mb-2">Address *</label>
                        <textarea
                          value={personalDraft.address}
                          onChange={(e) => updatePersonalDraft({ address: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                          placeholder="Address"
                        />
                      </div>

                      <div>
                        <label className="block text-[#309898] mb-2">Contact Number *</label>
                        <input
                          type="tel"
                          value={personalDraft.phoneNumber}
                          onChange={(e) => updatePersonalDraft({ phoneNumber: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 text-gray-800"
                          placeholder="Contact Number" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
