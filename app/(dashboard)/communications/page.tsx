import { getRetellCallLogs } from "@/lib/retell";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageSquare, PlayCircle, Clock } from "lucide-react";

export default async function CommunicationsPage() {
    // 1. Auth Check
    const cookieStore = await cookies();
    const merchantId = cookieStore.get("session_merchant_id")?.value;
    if (!merchantId) redirect("/");

    // 2. Fetch Data in Parallel
    // Fetch Retell Calls
    const callsPromise = getRetellCallLogs(20);

    // Fetch SMS/Emails from our Automation Logs table
    const logsPromise = supabaseAdmin
        .from("automation_logs")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false })
        .limit(50);

    const [calls, { data: messages }] = await Promise.all([callsPromise, logsPromise]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
                    <p className="text-muted-foreground">
                        Review AI interactions across phone, SMS, and email.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="calls" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="calls">Voice Calls (Retell)</TabsTrigger>
                    <TabsTrigger value="messages">Messages (SMS/Email)</TabsTrigger>
                </TabsList>

                {/* --- CALLS TAB --- */}
                <TabsContent value="calls" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Call History</CardTitle>
                            <CardDescription>
                                Inbound and outbound calls handled by your AI Receptionist.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Sentiment</TableHead>
                                        <TableHead className="text-right">Recording</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calls.map((call: any) => (
                                        <TableRow key={call.call_id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="capitalize">{call.call_status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{call.customer_phone || "Unknown"}</TableCell>
                                            <TableCell>
                                                {new Date(call.start_timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(call.duration_ms / 1000)}s
                                            </TableCell>
                                            <TableCell>
                                                {call.sentiment === 'negative' ? (
                                                    <Badge variant="destructive">Negative</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Neutral/Positive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {call.recording_url ? (
                                                    <a
                                                        href={call.recording_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-[#906CDD] hover:underline"
                                                    >
                                                        <PlayCircle className="mr-1 h-4 w-4" /> Play
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Processing</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- MESSAGES TAB --- */}
                <TabsContent value="messages" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Message Log</CardTitle>
                            <CardDescription>
                                Automated SMS and Emails sent by your retention campaigns.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Time Sent</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {messages?.map((msg) => (
                                        <TableRow key={msg.id}>
                                            <TableCell>
                                                {msg.action_type.includes('email') ? (
                                                    <div className="flex items-center"><Mail className="mr-2 h-4 w-4" /> Email</div>
                                                ) : (
                                                    <div className="flex items-center"><MessageSquare className="mr-2 h-4 w-4" /> SMS</div>
                                                )}
                                            </TableCell>
                                            <TableCell>{msg.description}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    Success
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!messages || messages.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No messages sent yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}