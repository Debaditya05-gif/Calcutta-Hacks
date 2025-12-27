import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message, history } = body

        if (!message) {
            return errorResponse("Message is required", 400)
        }

        if (!OPENROUTER_API_KEY) {
            console.error("Server Error: OPENROUTER_API_KEY is missing in environment variables")
            return errorResponse("Server Config Error: OpenRouter API key not configured", 500)
        }

        console.log(`Using OpenRouter API Key: ${OPENROUTER_API_KEY.substring(0, 5)}...`)

        // Construct the system prompt
        const systemPrompt = `You are a helpful voice assistant for the "Kolkata Explorer" app. 
        Your goal is to help users explore Kolkata, find heritage sites, restaurants, and plan trips.
        Keep your responses concise and conversational, suitable for voice output. 
        Avoid long lists or markdown formatting if possible, as it will be spoken.
        If the user asks about the app's features, guide them to the relevant sections (Map, Trip Planner, etc.).`

        // Convert history to OpenAI format (OpenRouter uses OpenAI format)
        let messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Add history if provided
        if (history && Array.isArray(history)) {
            // history from client is likely in Google format { role: 'user'|'model', parts: [{ text: '...' }] }
            // We need to convert it to OpenAI format { role: 'user'|'assistant', content: '...' }
            const validHistory = history.map((msg: any) => {
                let role = msg.role;
                if (role === 'model') role = 'assistant';
                
                let content = '';
                if (msg.parts && msg.parts[0] && msg.parts[0].text) {
                    content = msg.parts[0].text;
                } else if (msg.content) {
                    content = msg.content;
                }

                if (content) {
                    return { role, content };
                }
                return null;
            }).filter(Boolean);
            
            messages = [...messages, ...validHistory];
        }

        // Add the current message
        messages.push({
            role: "user",
            content: message
        });

        // Use a fast model on OpenRouter
        const modelName = "google/gemini-2.0-flash-001"; 
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        
        console.log(`Sending request to OpenRouter API (${modelName})...`);
        
        const response = await fetch(
            apiUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                    "X-Title": "Kolkata Explorer", // Optional
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 300,
                }),
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`OpenRouter API Error (${response.status}):`, errorText)
            return errorResponse(`OpenRouter API Error: ${response.status}`, response.status)
        }

        const data = await response.json()
        const generatedText = data.choices?.[0]?.message?.content

        if (!generatedText) {
             console.error("OpenRouter response missing text:", JSON.stringify(data))
             return errorResponse("Empty response from AI", 500)
        }

        return jsonResponse({
            success: true,
            reply: generatedText
        })

    } catch (error: any) {
        console.error("Chat route fatal error:", error)
        return errorResponse(`Internal Server Error: ${error.message}`, 500)
    }
}
