import { getRetellCallLogs } from "@/lib/retell";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CommunicationsClient } from "./client-view"; // Import the new component

export default async function CommunicationsPage() {
    const cookieStore = await cookies();
    const merchantId = cookieStore.get("session_merchant_id")?.value;
    if (!merchantId) redirect("/");

    // Fetch Data in Parallel
    const callsPromise = getRetellCallLogs(50);
    const logsPromise = supabaseAdmin
        .from("automation_logs")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false })
        .limit(50);

    const [calls, { data: messages }] = await Promise.all([callsPromise, logsPromise]);

    return (
        <CommunicationsClient
            calls={calls}
            messages={messages || []}
        />
    );
}