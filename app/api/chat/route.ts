import { NextResponse } from 'next/server';

function getKeys(envStr: string | undefined): string[] {
  if (!envStr) return [];
  return envStr.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    const systemPrompt = `You are ArcLight Copilot, an elite AI assistant for a city-scale sustainability intelligence platform.
You have access to real-time data from the city's sensors.
Always be concise, professional, and directly address the user's query using the data provided.

CURRENT CITY SENSOR DATA (Context):
${JSON.stringify(contextData, null, 2)}

Analyze this data to answer the user's question accurately.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    ];

    // 1. Keys Pools
    const geminiKeys = getKeys(process.env.GEMINI_API_KEYS || process.env.EXPO_PUBLIC_GEMINI_API_KEYS);
    const groqKeys = getKeys(process.env.GROQ_API_KEYS || process.env.NEXT_PUBLIC_GROQ_API_KEYS || '');
    const openAIKey = process.env.OPENAI_API_KEY;

    let finalResponseText = null;

    // 2. Try Gemini first (Best for large contexts, fast)
    if (geminiKeys.length > 0) {
      // Convert standard messages to Gemini format
      const geminiContents = apiMessages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      for (let i = 0; i < Math.min(5, geminiKeys.length); i++) {
        // Pick random key from the massive pool
        const key = geminiKeys[Math.floor(Math.random() * geminiKeys.length)];
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: geminiContents })
          });
          
          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              finalResponseText = text;
              console.log(`[AI Copilot] ✅ Served by Gemini (Key: ...${key.slice(-4)})`);
              break;
            }
          } else {
             const errorBody = await res.text();
             console.warn(`[AI Copilot] ⚠️ Gemini Error: ${res.status}`, errorBody.slice(0, 50));
          }
        } catch (err: any) {
           console.warn(`[AI Copilot] ⚠️ Gemini Exception: ${err.message}`);
        }
      }
    }

    // 3. Fallback to Groq
    if (!finalResponseText && groqKeys.length > 0) {
       console.log(`[AI Copilot] 🔄 Falling back to Groq...`);
       for (let i = 0; i < Math.min(3, groqKeys.length); i++) {
          const key = groqKeys[Math.floor(Math.random() * groqKeys.length)];
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: apiMessages,
                temperature: 0.2,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.choices?.[0]?.message?.content) {
                finalResponseText = data.choices[0].message.content;
                console.log(`[AI Copilot] ✅ Served by Groq (Key: ...${key.slice(-4)})`);
                break;
              }
            } else {
              const errorBody = await res.text();
              console.warn(`[AI Copilot] ⚠️ Groq Error: ${res.status}`, errorBody.slice(0, 50));
            }
          } catch(err: any) {
             console.warn(`[AI Copilot] ⚠️ Groq Exception: ${err.message}`);
          }
       }
    }

    // 4. Fallback to OpenAI
    if (!finalResponseText && openAIKey) {
       console.log(`[AI Copilot] 🔄 Falling back to OpenAI...`);
       try {
         const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: apiMessages,
              temperature: 0.2,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.choices?.[0]?.message?.content) {
              finalResponseText = data.choices[0].message.content;
              console.log(`[AI Copilot] ✅ Served by OpenAI`);
            }
          } else {
            const errorBody = await res.text();
            console.warn(`[AI Copilot] ⚠️ OpenAI Error: ${res.status}`, errorBody.slice(0, 50));
          }
       } catch (err: any) {
          console.warn(`[AI Copilot] ⚠️ OpenAI Exception: ${err.message}`);
       }
    }

    if (!finalResponseText) {
      throw new Error("All AI Providers (Gemini, Groq, OpenAI) failed.");
    }

    return NextResponse.json({ text: finalResponseText });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
