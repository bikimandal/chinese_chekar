import { NextResponse } from "next/server";
import { getUserStores } from "@/lib/user-access";

// GET - Get stores accessible to current user
export async function GET() {
  try {
    const stores = await getUserStores();
    return NextResponse.json(stores);
  } catch (error: any) {
    console.error("Error fetching accessible stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
