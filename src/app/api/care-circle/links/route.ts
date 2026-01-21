import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const getDisplayName = (personal: Record<string, unknown> | null) => {
  const fullName = typeof personal?.fullName === 'string' ? personal.fullName : '';
  if (fullName.trim()) {
    return fullName.trim();
  }
  const contactNumber =
    typeof personal?.contactNumber === 'string' ? personal.contactNumber : '';
  if (contactNumber.trim()) {
    return contactNumber.trim();
  }
  return 'Unknown member';
};

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { message: 'Service role key is missing.' },
      { status: 500 }
    );
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
    }
  );

  const { data: links, error: linksError } = await adminClient
    .from('care_circle_links')
    .select('id, requester_id, recipient_id, status, created_at')
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

  if (linksError) {
    return NextResponse.json({ message: linksError.message }, { status: 500 });
  }

  const memberIds = Array.from(
    new Set(
      (links ?? [])
        .flatMap((link) => [link.requester_id, link.recipient_id])
        .filter((id) => id && id !== user.id)
    )
  );

  const profileLookup: Record<string, Record<string, unknown> | null> = {};
  if (memberIds.length > 0) {
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('user_id, personal')
      .in('user_id', memberIds);
    (profiles ?? []).forEach((profile) => {
      profileLookup[profile.user_id] = profile.personal ?? null;
    });
  }

  const outgoing = (links ?? [])
    .filter((link) => link.requester_id === user.id)
    .map((link) => ({
      id: link.id,
      memberId: link.recipient_id,
      status: link.status,
      displayName: getDisplayName(profileLookup[link.recipient_id] ?? null),
      createdAt: link.created_at,
    }));

  const incoming = (links ?? [])
    .filter((link) => link.recipient_id === user.id)
    .map((link) => ({
      id: link.id,
      memberId: link.requester_id,
      status: link.status,
      displayName: getDisplayName(profileLookup[link.requester_id] ?? null),
      createdAt: link.created_at,
    }));

  return NextResponse.json({ outgoing, incoming });
}
