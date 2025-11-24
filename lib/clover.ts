import { supabaseAdmin } from "@/lib/supabase";

const BASE_URL = "https://sandbox.dev.clover.com/v3";

// Mock Data Fallbacks
const MOCK_MERCHANT = { name: "Offline Test Merchant" };
const MOCK_STATS = { total: 0, count: 0 };

export async function getMerchantInfo(merchantId: string, accessToken: string) {
    try {
        const res = await fetch(`${BASE_URL}/merchants/${merchantId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            // LOG THE REAL ERROR so we know why it failed
            const errorText = await res.text();
            console.error(`❌ Clover API Error (${res.status}):`, errorText);
            return MOCK_MERCHANT; // Return mock instead of crashing
        }

        return res.json();
    } catch (error) {
        console.error("❌ Network Error in getMerchantInfo:", error);
        return MOCK_MERCHANT;
    }
}

export async function getDailyStats(merchantId: string, accessToken: string) {
    try {
        const res = await fetch(`${BASE_URL}/merchants/${merchantId}/orders?limit=100`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`❌ Clover Stats Error (${res.status})`);
            return MOCK_STATS;
        }

        const data = await res.json();
        const orders = data.elements || [];

        const totalRevenue = orders.reduce((acc: number, order: any) => acc + (order.total || 0), 0);

        return {
            total: totalRevenue / 100,
            count: orders.length,
        };
    } catch (error) {
        console.error("❌ Network Error in getDailyStats:", error);
        return MOCK_STATS;
    }
}

export async function syncCustomers(merchantId: string, accessToken: string) {
    console.log("🔄 Starting Customer Sync...");

    // 1. Fetch from Clover
    const res = await fetch(`${BASE_URL}/merchants/${merchantId}/customers?limit=1000`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Clover Sync Failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const cloverCustomers = data.elements || [];

    if (cloverCustomers.length > 0) {
        console.log("🔍 RAW CLOVER CUSTOMER DATA (First Item):");
        console.dir(cloverCustomers[0], { depth: null });
    }

    console.log(`📥 Fetched ${cloverCustomers.length} customers. Saving to DB...`);

    // 2. Map to DB format
    const customersToUpsert = cloverCustomers.map((c: any) => ({
        id: c.id,
        merchant_id: merchantId,
        first_name: c.firstName,
        last_name: c.lastName,
        email: c.emailAddresses?.[0]?.emailAddress,
        phone_number: c.phoneNumbers?.[0]?.phoneNumber,
    }));

    if (customersToUpsert.length === 0) return 0;

    // 3. Save to Supabase
    const { error } = await supabaseAdmin
        .from("customers")
        .upsert(customersToUpsert, { onConflict: "id, merchant_id" });

    if (error) {
        console.error("Supabase Error:", error);
        throw error;
    }

    return customersToUpsert.length;
}