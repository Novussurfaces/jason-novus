import { NextResponse } from "next/server";
import { createCart, addToCart } from "@/lib/shopify";

export async function POST(request: Request) {
  try {
    const { action, variantId, quantity, cartId } = await request.json();

    if (!variantId) {
      return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
    }

    if (action === "add" && cartId) {
      const result = await addToCart(cartId, variantId, quantity || 1);
      if (result.userErrors?.length > 0) {
        return NextResponse.json({ error: result.userErrors[0].message }, { status: 400 });
      }
      return NextResponse.json({ cart: result.cart });
    }

    // Default: create new cart
    const result = await createCart(variantId, quantity || 1);
    if (result.userErrors?.length > 0) {
      return NextResponse.json({ error: result.userErrors[0].message }, { status: 400 });
    }
    return NextResponse.json({ cart: result.cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cart error";
    // If Shopify not configured, return helpful message
    if (message.includes("not configured")) {
      return NextResponse.json(
        { error: "Shopify store not yet configured. Contact us for orders!", redirect: "/soumission" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
