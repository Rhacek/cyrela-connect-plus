
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get appointments that:
    // 1. Are happening tomorrow or in less than 24 hours
    // 2. Have status CONFIRMADA (confirmed)
    // 3. Haven't had a reminder sent yet
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id, 
        client_name, 
        client_email,
        client_phone,
        date,
        time,
        title,
        property_id,
        broker_id,
        status
      `)
      .eq("status", "CONFIRMADA")
      .eq("reminder_sent", false)
      .eq("date", tomorrowStr);

    if (error) {
      console.error("Error fetching appointments:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${appointments.length} appointments for tomorrow that need reminders`);

    // For each appointment, send a reminder and mark as sent
    const sendPromises = appointments.map(async (appointment) => {
      try {
        // In a real-world scenario, you would send an email/SMS here

        // For now, just log it and mark as sent
        console.log(`[REMINDER] Would send reminder to ${appointment.client_name} (${appointment.client_email}) about appointment on ${appointment.date} at ${appointment.time}`);

        // Mark reminder as sent
        const { error: updateError } = await supabase.rpc(
          "mark_appointment_reminder_sent",
          { appointment_id: appointment.id }
        );

        if (updateError) {
          console.error(`Error marking reminder sent for appointment ${appointment.id}:`, updateError);
          return { id: appointment.id, success: false, error: updateError.message };
        }

        return { id: appointment.id, success: true };
      } catch (err) {
        console.error(`Error processing reminder for appointment ${appointment.id}:`, err);
        return { id: appointment.id, success: false, error: err.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        message: `Processed ${appointments.length} appointments, sent ${successCount} reminders successfully`,
        results
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
