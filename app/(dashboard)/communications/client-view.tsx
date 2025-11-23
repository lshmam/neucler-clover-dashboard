"use client";

import { useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Phone, Mail, MessageSquare, PlayCircle, Clock,
    Search, Send, Plus, Users, Radio, MoreVertical,
    Bot, CheckCircle2, XCircle, Filter, ArrowUpRight
} from "lucide-react";

// Types for our data
type CallLog = any; // Replace with specific types if available
type SmsLog = any;

interface CommunicationsClientProps {
    calls: CallLog[];
    messages: SmsLog[];
}

export function CommunicationsClient({ calls, messages }: CommunicationsClientProps) {
    const [selectedSmsId, setSelectedSmsId] = useState<string | null>(messages[0]?.id || "1");
    const [activeTab, setActiveTab] = useState("calls");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
                    <p className="text-muted-foreground">
                        Central command for Calls, SMS, Email, and AI interactions.
                    </p>
                </div>
                <Button className="bg-[#906CDD] hover:bg-[#7a5bb5]">
                    <Plus className="mr-2 h-4 w-4" /> New Message
                </Button>
            </div>

            <Tabs defaultValue="calls" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
                <div className="shrink-0">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="calls" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#906CDD] px-6 py-3">AI Calls</TabsTrigger>
                        <TabsTrigger value="sms" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#906CDD] px-6 py-3">SMS Conversations</TabsTrigger>
                        <TabsTrigger value="email" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#906CDD] px-6 py-3">Email Campaigns</TabsTrigger>
                        <TabsTrigger value="broadcasts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#906CDD] px-6 py-3">Broadcasts</TabsTrigger>
                        <TabsTrigger value="ai-chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#906CDD] px-6 py-3">AI Chat Assistant</TabsTrigger>
                    </TabsList>
                </div>

                {/* --- TAB 1: AI CALLS --- */}
                <TabsContent value="calls" className="flex-1 overflow-auto p-1">
                    <Card className="h-full border-none shadow-none">
                        <div className="flex items-center gap-4 py-4">
                            <Input placeholder="Search calls..." className="max-w-sm" />
                            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        </div>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Transcript Preview</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calls.map((call) => (
                                        <TableRow key={call.call_id}>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">Inbound</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{call.customer_phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={call.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                    {call.call_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                                {call.transcript || "No transcript available..."}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(call.start_timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(call.duration_ms / 1000)}s
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="text-[#906CDD]">View Details</Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="w-[400px] sm:w-[540px]">
                                                        <SheetHeader>
                                                            <SheetTitle>Call Details</SheetTitle>
                                                            <SheetDescription>
                                                                Recorded on {new Date(call.start_timestamp).toLocaleString()}
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                        <div className="py-6 space-y-6">
                                                            {/* Audio Player Mock */}
                                                            <div className="bg-slate-50 p-4 rounded-lg border">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium">Audio Recording</span>
                                                                    <span className="text-xs text-muted-foreground">{Math.round(call.duration_ms / 1000)}s</span>
                                                                </div>
                                                                <div className="h-8 bg-slate-200 rounded-full w-full relative overflow-hidden">
                                                                    <div className="absolute left-0 top-0 bottom-0 bg-[#906CDD] w-1/3 opacity-50"></div>
                                                                    <PlayCircle className="absolute left-2 top-1.5 h-5 w-5 text-slate-700" />
                                                                </div>
                                                            </div>

                                                            {/* Transcript */}
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Transcript</h4>
                                                                <ScrollArea className="h-[300px] w-full rounded-md border p-4 text-sm text-muted-foreground">
                                                                    {call.transcript ? call.transcript : "Transcript generating..."}
                                                                </ScrollArea>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-2">
                                                                <Button className="flex-1 bg-[#906CDD]"><MessageSquare className="mr-2 h-4 w-4" /> Send SMS Follow-up</Button>
                                                                <Button variant="outline" className="flex-1">Flag for Review</Button>
                                                            </div>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB 2: SMS CONVERSATIONS (Split View) --- */}
                <TabsContent value="sms" className="flex-1 overflow-hidden border rounded-lg">
                    <div className="grid grid-cols-12 h-full bg-white">
                        {/* LEFT PANEL: List */}
                        <div className="col-span-4 border-r flex flex-col">
                            <div className="p-4 border-b">
                                <Input placeholder="Search messages..." />
                            </div>
                            <ScrollArea className="flex-1">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedSmsId(msg.id)}
                                        className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selectedSmsId === msg.id ? 'bg-purple-50 border-l-4 border-l-[#906CDD]' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold">Customer Name</span>
                                            <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.description}</p>
                                    </div>
                                ))}
                                {/* Mock Extra Items */}
                                <div className="p-4 border-b cursor-pointer hover:bg-slate-50">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold">Jane Doe</span>
                                        <span className="text-xs text-muted-foreground">10:42 AM</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">Yes, please reschedule my appointment to next Tuesday.</p>
                                    <Badge variant="secondary" className="mt-2 text-[10px]">Needs Reply</Badge>
                                </div>
                            </ScrollArea>
                        </div>

                        {/* RIGHT PANEL: Chat View */}
                        <div className="col-span-8 flex flex-col h-full">
                            {/* Chat Header */}
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-slate-200">JD</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-sm">Jane Doe</h3>
                                        <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4 bg-slate-50/30">
                                <div className="space-y-4">
                                    {/* AI Message */}
                                    <div className="flex justify-end">
                                        <div className="bg-[#906CDD] text-white rounded-l-lg rounded-tr-lg p-3 max-w-[70%] text-sm">
                                            Hi Jane! It looks like it's been 4 weeks since your last cut. Want to book for this week?
                                        </div>
                                    </div>
                                    {/* Customer Message */}
                                    <div className="flex justify-start">
                                        <div className="bg-white border text-gray-800 rounded-r-lg rounded-tl-lg p-3 max-w-[70%] text-sm shadow-sm">
                                            Yes, please reschedule my appointment to next Tuesday at 2pm.
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* Composer */}
                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2 mb-2 overflow-x-auto">
                                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200">Confirm Appointment</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200">Send Pricing</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Textarea placeholder="Type a message..." className="min-h-[60px]" />
                                    <Button className="h-auto bg-[#906CDD] hover:bg-[#7a5bb5]"><Send className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAB 3: EMAIL CAMPAIGNS --- */}
                <TabsContent value="email" className="space-y-4 overflow-auto p-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Campaign Card 1 */}
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge>Sent</Badge>
                                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                </div>
                                <CardTitle className="text-lg">October Newsletter</CardTitle>
                                <CardDescription>Sent Oct 15 • 1,240 Recipients</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-xl font-bold">42%</div>
                                        <div className="text-xs text-muted-foreground">Open Rate</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">12%</div>
                                        <div className="text-xs text-muted-foreground">Click Rate</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-green-600">$1.2k</div>
                                        <div className="text-xs text-muted-foreground">Revenue</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Campaign Card 2 */}
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">Draft</Badge>
                                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                </div>
                                <CardTitle className="text-lg">Black Friday Early Access</CardTitle>
                                <CardDescription>Scheduled Nov 20 • VIP Segment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
                                    Ready to Schedule
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- TAB 4: BROADCASTS --- */}
                <TabsContent value="broadcasts" className="space-y-4 overflow-auto p-1">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Broadcast History</CardTitle>
                                    <CardDescription>Mass announcements sent via SMS, Email, or Voice.</CardDescription>
                                </div>
                                <Button><Radio className="mr-2 h-4 w-4" /> Create Broadcast</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Channel</TableHead>
                                        <TableHead>Audience</TableHead>
                                        <TableHead>Sent Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Holiday Hours Update</TableCell>
                                        <TableCell><div className="flex items-center gap-2"><MessageSquare className="h-3 w-3" /> SMS</div></TableCell>
                                        <TableCell>All Customers (540)</TableCell>
                                        <TableCell>Dec 20, 2024</TableCell>
                                        <TableCell><Badge className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">VIP Exclusive Event</TableCell>
                                        <TableCell><div className="flex items-center gap-2"><Mail className="h-3 w-3" /> Email</div></TableCell>
                                        <TableCell>VIP Segment (45)</TableCell>
                                        <TableCell>Nov 01, 2024</TableCell>
                                        <TableCell><Badge className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB 5: AI CHAT ASSISTANT --- */}
                <TabsContent value="ai-chat" className="flex-1 overflow-hidden border rounded-lg bg-slate-50">
                    <div className="grid grid-cols-12 h-full">
                        <div className="col-span-3 border-r bg-white p-4 space-y-4">
                            <h3 className="font-semibold mb-4">AI Chat Logs</h3>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 cursor-pointer">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-sm">Booking Inquiry</span>
                                        <span className="text-[10px] text-muted-foreground">2m ago</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">Customer asked about availability...</p>
                                </div>
                                <div className="p-3 rounded-lg border hover:bg-slate-50 cursor-pointer">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-sm">Pricing Question</span>
                                        <span className="text-[10px] text-muted-foreground">1h ago</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">Customer asked about gel pricing...</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-9 p-8 flex flex-col items-center justify-center text-center">
                            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">Select a conversation</h3>
                            <p className="text-muted-foreground max-w-md">
                                Review how your AI Assistant interacts with customers. You can flag responses to improve training.
                            </p>
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}