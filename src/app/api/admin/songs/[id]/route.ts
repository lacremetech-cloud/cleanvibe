import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { supabase: null, error: 'Forbidden' }

  return { supabase, error: null }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { supabase, error } = await getAdminClient()
  if (!supabase) return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 })

  const body = await req.json()
  const { data, err } = await supabase.from('songs').update(body).eq('id', id).select().single() as any

  if (err) return NextResponse.json({ error: err.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { supabase, error } = await getAdminClient()
  if (!supabase) return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 })

  const { error: err } = await supabase.from('songs').delete().eq('id', id)

  if (err) return NextResponse.json({ error: err.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
