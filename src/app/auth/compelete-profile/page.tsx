'use client';

import { supabase } from '@/lib/createClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_complete')
        .eq('user_id', user.id)
        .maybeSingle();

      // Profile already complete → skip
      if (profile?.profile_complete) {
        router.replace('/homepage');
      }
    }

    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        personal: {
          fullName,
          gender,
          dob,
        },
        profile_complete: true,
      })
      .eq('user_id', user.id);

    setLoading(false);

    if (error) {
      alert('Failed to complete profile');
      return;
    }

    router.replace('/homepage');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl text-[#309898] mb-4">
          Complete your profile
        </h1>

        <input
          required
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-3 px-4 py-3 border rounded-lg"
        />

        <input
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full mb-3 px-4 py-3 border rounded-lg"
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg"
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
