import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { getMerchantInfo, getDailyStats } from "@/lib/clover";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    DollarSign,
    Users,
    ShoppingBag,
    Activity,
    Sparkles,
    ArrowUpRight
} from "lucide-react";

export default async function DashboardPage() {
    // 1. Get the Merchant ID from the session cookie
    // This identifies WHICH user is logged in without exposing the access token
    const cookieStore = await cookies();
    const merchantId = cookieStore.get("session_merchant_id")?.value;

    if (!merchantId) {
        // No session cookie? Redirect to login/home
        redirect("/");
    }

    // 2. Fetch the secure Access Token from Supabase
    // We use the admin client because this is a secure server-side operation
    const { data: merchant, error } = await supabaseAdmin
        .from("merchants")
        .select("access_token")
        .eq("clover_merchant_id", merchantId)
        .single();

    if (error || !merchant) {
        console.error("❌ Database Error: Merchant not found or token missing.");
        // Ideally, clear the cookie here, but for now just redirect
        redirect("/");
    }

    const accessToken = merchant.access_token;

    // 3. Fetch Live Data from Clover (Parallel Requests for Speed)
    // We wrap this in a try/catch block to prevent the whole page from crashing if Clover is down
    let merchantInfo;
    let stats;

    try {
        const [infoData, statsData] = await Promise.all([
            getMerchantInfo(merchantId, accessToken),
            getDailyStats(merchantId, accessToken),
        ]);
        merchantInfo = infoData;
        stats = statsData;
    } catch (err) {
        console.error("❌ API Error: Failed to fetch data from Clover", err);
        // Fallback data so the page still renders
        merchantInfo = { name: "Valued Merchant" };
        stats = { total: 0, count: 0 };
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="font-semibold text-primary">{merchantInfo.name}</span>. Here is what's happening today.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Placeholder for a date range picker or export button */}
                    <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-md border shadow-sm">
                        Today: {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Card 1: Revenue */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.count}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12 since yesterday
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: AI Opportunities (The "Hook") */}
                <Card className="border-l-4 border-l-[#906CDD]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Opportunities</CardTitle>
                        <Sparkles className="h-4 w-4 text-[#906CDD]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Overdue clients identified
                        </p>
                    </CardContent>
                </Card>

                {/* Card 4: Active Loyalty */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Chart Area Placeholder */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Your daily revenue performance for the current month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[240px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                            <p className="text-muted-foreground text-sm">Chart Component Coming Soon</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent AI Activity</CardTitle>
                        <CardDescription>
                            Automated actions taken by your AI receptionist.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Mock Data for now - we will hook this up to Supabase later */}
                            <div className="flex items-center">
                                <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#906CDD] items-center justify-center text-white text-xs">
                                    AI
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Booked Appointment</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sarah L. for "Gel Manicure"
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
                            </div>

                            <div className="flex items-center">
                                <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 items-center justify-center text-xs">
                                    AI
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Sent Reminder</p>
                                    <p className="text-sm text-muted-foreground">
                                        SMS to Mark T. (Tomorrow 2pm)
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground">2m ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}