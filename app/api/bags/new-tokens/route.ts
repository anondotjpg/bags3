// app/api/bags/new-tokens/route.ts
import { NextResponse } from "next/server";

const BAGS_AUTHORITY = "BAGSB9TpGrZxQbEsrEznv5jXXdwyP6AXerN8aVRiAmcv";
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const DAS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function GET() {
  if (!HELIUS_API_KEY) {
    console.error("Missing HELIUS_API_KEY");
    return NextResponse.json(
      { error: "Missing HELIUS_API_KEY env var" },
      { status: 500 },
    );
  }

  try {
    const body = {
      jsonrpc: "2.0",
      id: "bags-assets",
      method: "getAssetsByAuthority",
      params: {
        authorityAddress: BAGS_AUTHORITY,
        page: 1,
        limit: 12,
        sortBy: {
          sortBy: "created",
          sortDirection: "desc",
        },
      },
    };

    const res = await fetch(DAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Helius DAS HTTP error:", res.status, text);
      return NextResponse.json(
        { error: `Helius HTTP ${res.status}`, details: text },
        { status: 502 },
      );
    }

    const json = await res.json();

    if (json.error) {
      console.error("Helius DAS JSON-RPC error:", json.error);
      return NextResponse.json(
        { error: "Helius DAS error", details: json.error },
        { status: 502 },
      );
    }

    const items: any[] = json?.result?.items ?? [];

    const tokens = items.map((item) => {
      const mint = item.id as string;

      const content = item.content ?? {};
      const metadata = content.metadata ?? {};
      const links = content.links ?? {};
      const files = content.files ?? [];

      const name =
        metadata.name ??
        metadata.symbol ??
        (mint ? mint.slice(0, 6) + "…" : "Unknown");

      const symbol = metadata.symbol ?? "";

      const image =
        links.image ??
        (Array.isArray(files) && files[0]?.uri) ??
        null;

      return {
        mint,
        name,
        symbol,
        image,
        // pass through all content.links so we can render them in the UI
        links,
      };
    });

    // De-dupe just in case
    const seen = new Set<string>();
    const unique = tokens.filter((t) => {
      if (seen.has(t.mint)) return false;
      seen.add(t.mint);
      return true;
    });

    return NextResponse.json({ tokens: unique }, { status: 200 });
  } catch (e: any) {
    console.error("Unexpected error in /api/bags/new-tokens:", e);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}