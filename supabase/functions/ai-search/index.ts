import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock data representing available services/instructors
const availableServices = [
  { id: 1, title: 'Vinyasa Flow Yoga', provider: 'Sarah Chen', category: 'yoga', price: '$45', location: 'Downtown' },
  { id: 2, title: 'CBT Therapy Session', provider: 'Dr. Michael Ross', category: 'therapy', price: '$120', location: 'Online' },
  { id: 3, title: 'Brazilian Jiu-Jitsu', provider: 'Carlos Silva', category: 'sports', price: '$35', location: 'Midtown' },
  { id: 4, title: 'Mountain Hiking Guide', provider: 'Alex Turner', category: 'outdoor', price: '$80', location: 'Various' },
  { id: 5, title: 'Piano Lessons', provider: 'Emma Williams', category: 'arts', price: '$55', location: 'East Side' },
  { id: 6, title: 'Math Tutoring', provider: 'David Kim', category: 'tutoring', price: '$40', location: 'Online' },
  { id: 7, title: 'Guided Meditation', provider: 'Maya Johnson', category: 'therapy', price: '$35', location: 'Online' },
  { id: 8, title: 'Life Coaching Session', provider: 'James Wilson', category: 'therapy', price: '$95', location: 'Online' },
  { id: 9, title: 'Anxiety Counseling', provider: 'Dr. Sarah Lee', category: 'therapy', price: '$110', location: 'Online' },
  { id: 10, title: 'Mindfulness Training', provider: 'Zen Master Liu', category: 'therapy', price: '$50', location: 'Downtown' },
  { id: 11, title: 'Couples Counseling', provider: 'Dr. Robert Hayes', category: 'therapy', price: '$150', location: 'Online' },
  { id: 12, title: 'Kickboxing Training', provider: 'Mike Johnson', category: 'sports', price: '$40', location: 'Downtown' },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful wellness and coaching assistant for an app that connects people with instructors and coaches. 

Here are the available services and instructors:
${JSON.stringify(availableServices, null, 2)}

When a user asks for help finding something:
1. Understand their needs (mental health, fitness, learning, etc.)
2. Recommend relevant services from the available list
3. Be warm, empathetic, and helpful
4. Keep responses concise but informative
5. If they need something not in the list, acknowledge it and suggest similar alternatives

Format your recommendations clearly with the service name, provider, price, and why it might be a good fit.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
