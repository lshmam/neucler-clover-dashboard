import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    // 1. Get code AND merchant_id from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const urlMerchantId = searchParams.get("merchant_id"); // <--- Grab it from here!

    if (!code) {
        return NextResponse.redirect(new URL("/?error=no_code", request.url));
    }

    try {
        // Verify Env Vars
        if (!process.env.CLOVER_APP_ID || !process.env.CLOVER_APP_SECRET) {
            return NextResponse.redirect(new URL("/?error=missing_env_vars", request.url));
        }

        // 2. Exchange Code for Token
        const formData = new URLSearchParams();
        formData.append("client_id", process.env.CLOVER_APP_ID);
        formData.append("client_secret", process.env.CLOVER_APP_SECRET);
        formData.append("code", code);

        const response = await fetch("https://sandbox.dev.clover.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            cache: "no-store",
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Token Error:", text);
            return NextResponse.redirect(new URL("/?error=token_failed", request.url));
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // 3. Determine the final Merchant ID
        // Prefer the one from the token response, fallback to the URL parameter
        const finalMerchantId = data.merchant_id || urlMerchantId;

        if (!finalMerchantId) {
            console.error("❌ Error: Merchant ID is missing from both Token and URL");
            return NextResponse.redirect(new URL("/?error=missing_merchant_id", request.url));
        }

        // 4. Save to Supabase
        const { error: dbError } = await supabaseAdmin
            .from('merchants')
            .upsert({
                clover_merchant_id: finalMerchantId,
                access_token: accessToken,
            }, { onConflict: 'clover_merchant_id' });

        if (dbError) {
            console.error("Supabase Error:", dbError);
            return NextResponse.redirect(new URL("/?error=db_save_failed", request.url));
        }

        // 5. Set Session Cookie
        const cookieStore = await cookies();
        cookieStore.set("session_merchant_id", finalMerchantId, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.redirect(new URL("/dashboard?status=connected", request.url));

    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.redirect(new URL("/?error=internal", request.url));
    }
}