'use client'

import { supabase } from "@/lib/createClient"
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function AuthCallback(){
    const router = useRouter();

    useEffect(() => {
        async function checkProfile() {
            const { data: { user } } = await  supabase.auth.getUser();

            if (!user) {
                router.push('/login')
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_id')
                .eq('user_id', user.id)
                .single();

            if (!profile || error){
                alert('Your Account Doesnt Exist Please Sign Up first')
                router.push('/signup');
                return;
            }

            router.push('/homepage');
        }
        checkProfile();
    }, [])
    return <p>Checking Account...</p>
}