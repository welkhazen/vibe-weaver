import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Available services/instructors data
const availableServices = [
  { id: 1, title: 'Vinyasa Flow Yoga', provider: 'Sarah Chen', category: 'yoga', subcategory: null, price: 45, location: 'Downtown', sessionType: 'single', rating: 4.9 },
  { id: 2, title: 'CBT Therapy Session', provider: 'Dr. Michael Ross', category: 'therapy', subcategory: 'therapy-sub', price: 120, location: 'Online', sessionType: 'single', rating: 4.8 },
  { id: 3, title: 'Brazilian Jiu-Jitsu', provider: 'Carlos Silva', category: 'sports', subcategory: null, price: 35, location: 'Midtown', sessionType: 'group', rating: 4.9 },
  { id: 4, title: 'Mountain Hiking Guide', provider: 'Alex Turner', category: 'outdoor', subcategory: null, price: 80, location: 'Various', sessionType: 'group', rating: 4.7 },
  { id: 5, title: 'Piano Lessons', provider: 'Emma Williams', category: 'arts', subcategory: null, price: 55, location: 'East Side', sessionType: 'single', rating: 5.0 },
  { id: 6, title: 'Math Tutoring', provider: 'David Kim', category: 'tutoring', subcategory: null, price: 40, location: 'Online', sessionType: 'package', rating: 4.8 },
  { id: 7, title: 'Pilates Reformer', provider: 'Lisa Park', category: 'yoga', subcategory: null, price: 50, location: 'Westside', sessionType: 'single', rating: 4.9 },
  { id: 8, title: 'Life Coaching Session', provider: 'James Wilson', category: 'therapy', subcategory: 'coaching', price: 95, location: 'Online', sessionType: 'package', rating: 4.6 },
  { id: 9, title: 'Kickboxing Training', provider: 'Mike Johnson', category: 'sports', subcategory: null, price: 40, location: 'Downtown', sessionType: 'group', rating: 4.8 },
  { id: 10, title: 'Anxiety Counseling', provider: 'Dr. Sarah Lee', category: 'therapy', subcategory: 'anxiety', price: 110, location: 'Online', sessionType: 'single', rating: 4.9 },
  { id: 11, title: 'Rock Climbing Guide', provider: 'Jake Miller', category: 'outdoor', subcategory: null, price: 75, location: 'Boulder Park', sessionType: 'group', rating: 4.8 },
  { id: 12, title: 'Guitar Lessons', provider: 'Tom Garcia', category: 'arts', subcategory: null, price: 50, location: 'Midtown', sessionType: 'single', rating: 4.7 },
  { id: 13, title: 'Guided Meditation', provider: 'Maya Johnson', category: 'therapy', subcategory: 'meditation', price: 35, location: 'Online', sessionType: 'single', rating: 4.9 },
  { id: 14, title: 'Stress Relief Workshop', provider: 'Dr. Emily Chen', category: 'therapy', subcategory: 'stress', price: 65, location: 'Midtown', sessionType: 'group', rating: 4.8 },
  { id: 15, title: 'Mindfulness Training', provider: 'Zen Master Liu', category: 'therapy', subcategory: 'mindfulness', price: 50, location: 'Downtown', sessionType: 'package', rating: 5.0 },
  { id: 16, title: 'Couples Counseling', provider: 'Dr. Robert Hayes', category: 'therapy', subcategory: 'relationship', price: 150, location: 'Online', sessionType: 'single', rating: 4.7 },
  { id: 17, title: 'Family Therapy', provider: 'Dr. Anna Martinez', category: 'therapy', subcategory: 'relationship', price: 140, location: 'Westside', sessionType: 'package', rating: 4.8 },
  { id: 18, title: 'Executive Coaching', provider: 'Mark Stevens', category: 'therapy', subcategory: 'coaching', price: 200, location: 'Online', sessionType: 'package', rating: 4.9 },
];

const categories = [
  { id: 'therapy', label: 'Therapy / Mental Health' },
  { id: 'yoga', label: 'Yoga / Pilates' },
  { id: 'sports', label: 'Sports / Martial Arts' },
  { id: 'outdoor', label: 'Outdoor Activities' },
  { id: 'arts', label: 'Arts / Music / Dance' },
  { id: 'tutoring', label: 'Tutoring / Education' },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a warm, friendly wellness guide helping people find the perfect instructor or service. Your role is to have a natural conversation to understand their needs.

AVAILABLE SERVICES:
${JSON.stringify(availableServices, null, 2)}

CATEGORIES:
${JSON.stringify(categories, null, 2)}

YOUR APPROACH:
1. Start by understanding what they're looking for in a conversational way
2. Ask clarifying questions ONE AT A TIME to understand:
   - What type of support they need (mental health, fitness, learning, creative, outdoor)
   - Their budget range (if not mentioned)
   - Preferred format (online, in-person, group, individual)
   - Any specific goals or concerns
3. After 2-3 exchanges, provide personalized recommendations
4. When recommending, include: service name, provider, price, location, and WHY it's a good fit for them

GUIDELINES:
- Be empathetic and encouraging
- Keep responses concise (2-3 sentences for questions, more for recommendations)
- Use a warm, supportive tone
- If they seem unsure, offer gentle guidance
- When making final recommendations, format them clearly with bullet points
- If nothing matches exactly, suggest the closest alternatives

Remember: You're a helpful guide, not a salesperson. Focus on finding what truly fits their needs.`;

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
          ...messages,
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
