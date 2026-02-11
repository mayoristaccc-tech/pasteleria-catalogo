import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { email, role } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false
    })

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 400,
    })
  }

  const { error: profileError } = await supabaseAdmin
    .from("admin_profiles")
    .insert({
      id: userData.user.id,
      email,
      role: role || "admin"
    })

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 400,
    })
  }

  await supabaseAdmin.auth.admin.inviteUserByEmail(email)

  return new Response(
    JSON.stringify({ message: "Usuario creado correctamente" }),
    { status: 200 }
  )
})
