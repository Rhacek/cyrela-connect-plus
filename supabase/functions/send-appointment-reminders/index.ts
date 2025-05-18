
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get appointments that need reminders (tomorrow's appointments that haven't had reminders sent)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Calculate tomorrow's date in ISO format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Get appointments for tomorrow that haven't had reminders sent
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id, 
        title, 
        date, 
        time, 
        client_name, 
        client_email, 
        client_phone,
        status,
        properties(title, address),
        profiles!broker_id(name, email, phone)
      `)
      .eq("date", tomorrowStr)
      .eq("reminder_sent", false)
      .in("status", ["AGENDADA", "CONFIRMADA"]);

    if (error) {
      console.error("Error fetching appointments:", error);
      return new Response(
        JSON.stringify({ error: "Error fetching appointments" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ message: "No reminders to send" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Loop through appointments and send reminders
    const results = [];
    for (const appointment of appointments) {
      // In a real implementation, you would send emails here using a service like Resend
      // For now, we'll just log the reminders and update the reminder_sent flag
      console.log(`Sending reminder for appointment ${appointment.id}:`);
      console.log(`- Client: ${appointment.client_name} (${appointment.client_email})`);
      console.log(`- Property: ${appointment.properties.title}`);
      console.log(`- Date/Time: ${appointment.date} at ${appointment.time}`);
      console.log(`- Broker: ${appointment.profiles.name}`);

      // Mark reminder as sent
      const { error: updateError } = await supabase.rpc("mark_appointment_reminder_sent", {
        appointment_id: appointment.id
      });

      if (updateError) {
        console.error(`Error marking reminder as sent for appointment ${appointment.id}:`, updateError);
        results.push({
          id: appointment.id,
          success: false,
          error: updateError.message
        });
      } else {
        results.push({
          id: appointment.id,
          success: true
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Sent ${results.filter(r => r.success).length} reminders`,
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
