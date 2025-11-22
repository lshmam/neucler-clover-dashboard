import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  // Construct the Clover authorization URL
  // We use environment variables to make this secure and flexible
  const cloverAuthUrl = `https://sandbox.dev.clover.com/oauth/authorize?client_id=${process.env.CLOVER_APP_ID}&redirect_uri=http://localhost:3000/clover/callback`;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Your AI Autopilot</h1>
      <p className="text-muted-foreground mb-8">Connect your Clover account to get started.</p>

      {/* This Link component acts as the button that starts the entire process */}
      <Link href={cloverAuthUrl}>
        <Button size="lg">Connect to Clover</Button>
      </Link>
    </main>
  );
}