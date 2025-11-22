import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"; // Check your import path, might need @/components...
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, MoreHorizontal } from "lucide-react";

// Helper to assign status based on logic
const getStatus = (visits: number, spend: number) => {
    if (spend > 500) return { label: "VIP", color: "bg-purple-100 text-purple-800" };
    if (visits === 1) return { label: "New", color: "bg-blue-100 text-blue-800" };
    if (visits === 0) return { label: "Lead", color: "bg-gray-100 text-gray-800" };
    return { label: "Active", color: "bg-green-100 text-green-800" };
};

export default async function CustomersPage() {
    // 1. Get the Merchant ID from the cookie
    const cookieStore = await cookies();
    const merchantId = cookieStore.get("session_merchant_id")?.value;

    if (!merchantId) redirect("/");

    // 2. Fetch ALL customers for this merchant
    const { data: customers } = await supabaseAdmin
        .from("customers")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("last_name", { ascending: true })
        .limit(50);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">
                        Manage your client relationships and view loyalty status.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button className="bg-[#906CDD] hover:bg-[#7a5bb5]">
                        + Add Customer
                    </Button>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center flex-1 gap-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search customers..." className="pl-8" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead>Total Visits</TableHead>
                            <TableHead>Total Spend</TableHead>
                            <TableHead>Loyalty Pts</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers?.map((customer) => {
                            const status = getStatus(customer.visit_count || 0, customer.total_spend_cents || 0);
                            return (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        {/* Link to the Profile Page */}
                                        <Link href={`/customers/${customer.id}`} className="hover:underline decoration-[#906CDD]">
                                            {customer.first_name} {customer.last_name}
                                        </Link>
                                        <div className="text-xs text-muted-foreground">{customer.email || customer.phone_number}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${status.color} hover:${status.color}`}>
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {customer.last_visit_date ? new Date(customer.last_visit_date).toLocaleDateString() : "N/A"}
                                    </TableCell>
                                    <TableCell>{customer.visit_count || 0}</TableCell>
                                    <TableCell>
                                        ${((customer.total_spend_cents || 0) / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell>{Math.floor((customer.total_spend_cents || 0) / 100)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {(!customers || customers.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No customers found. Try syncing data!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}