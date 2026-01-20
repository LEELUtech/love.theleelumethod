import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Firestore instance
import { collection, doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, productType, birthDate1, birthDate2 } = body;

		// Validate required fields
		if (!email || !productType) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Additional validation for compatibility_report
		if (
			productType === "compatibility_report" &&
			(!birthDate1 || !birthDate2)
		) {
			return NextResponse.json(
				{ error: "Missing birth dates for compatibility report" },
				{ status: 400 },
			);
		}

		// Fetch product data from Firestore
		const productDocRef = doc(collection(db, "offerings"), productType);
		const productDoc = await getDoc(productDocRef);
		if (!productDoc.exists) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		const product = productDoc.data();

		if (!product) {
			return NextResponse.json(
				{ error: "Product data is undefined" },
				{ status: 500 },
			);
		}

		// Log product data for debugging
		console.log("Fetched product data:", product);

		// Ensure currency is defined, fallback to 'USD'
		const currency = product.currency || "USD";

		// Create Stripe Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: currency, // Use the validated or fallback currency
						product_data: {
							name: product.name,
							description: product.description,
						},
						unit_amount: product.price,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/cancel`,
			customer_email: email,
			metadata: {
				product_type: productType,
				...(productType === "compatibility_report" && {
					birth_date_1: birthDate1,
					birth_date_2: birthDate2,
				}),
			},
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json(
			{ error: "Failed to create checkout session" },
			{ status: 500 },
		);
	}
}
