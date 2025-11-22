const RETELL_BASE_URL = "https://api.retellai.com";

// --- MOCK DATA (Fallback) ---
const MOCK_CALLS = [
    {
        call_id: "mock_1",
        agent_id: "agent_123",
        customer_phone: "+15550101",
        call_status: "ended",
        start_timestamp: Date.now() - 100000,
        duration_ms: 120000,
        transcript: "Hello, I'd like to book an appointment...",
        recording_url: "#",
        sentiment: "positive"
    },
    {
        call_id: "mock_2",
        agent_id: "agent_123",
        customer_phone: "+15550199",
        call_status: "ended",
        start_timestamp: Date.now() - 500000,
        duration_ms: 45000,
        transcript: "Please remove me from your list.",
        recording_url: "#",
        sentiment: "negative"
    }
];

export async function getRetellCallLogs(limit = 20) {
    // 1. Check for API Key
    if (!process.env.RETELL_API_KEY) {
        console.warn("⚠️ Missing RETELL_API_KEY in .env.local. Using Mock Data.");
        return MOCK_CALLS;
    }

    try {
        // 2. Use POST method (Retell V2 Requirement)
        const res = await fetch(`${RETELL_BASE_URL}/v2/list-calls`, {
            method: "POST", // <--- CHANGED FROM GET TO POST
            headers: {
                "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                limit: limit,
                sort_order: "descending"
            }),
            next: { revalidate: 60 }
        });

        // 3. Handle API Errors Gracefully
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ Retell API Error (${res.status}):`, errorText);
            return MOCK_CALLS; // Return mock data so page doesn't crash
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("❌ Network Error in getRetellCallLogs:", error);
        return MOCK_CALLS;
    }
}