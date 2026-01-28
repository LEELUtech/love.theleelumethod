// app/api/checkout/update-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe"

const stripe = getStripe();

type Body = {
	intentId: string;
	productType: string;

	// Customer information
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;

	// Billing address
	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;

	// Product specific data
	birthDate1?: string;
	birthDate2?: string;
};

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as Body;

		const intentId = body.intentId?.trim();
		const productType = body.productType?.trim();
		const email = body.email?.trim();

		if (!intentId) {
			return NextResponse.json({ error: "Missing intentId" }, { status: 400 });
		}
		if (!productType) {
			return NextResponse.json(
				{ error: "Missing productType" },
				{ status: 400 },
			);
		}
		if (!email) {
			return NextResponse.json({ error: "Missing email" }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}

		// Prepare metadata
		const metadata: Record<string, string> = {
			product_type: productType,
			email,
			updated_at: new Date().toISOString(),
		};

		// Add optional customer info
		if (body.firstName) metadata.first_name = body.firstName.trim();
		if (body.lastName) metadata.last_name = body.lastName.trim();
		if (body.phone) metadata.phone = body.phone.trim();

		// Add optional address info
		if (body.address1) metadata.address_line1 = body.address1.trim();
		if (body.address2) metadata.address_line2 = body.address2.trim();
		if (body.city) metadata.city = body.city.trim();
		if (body.state) metadata.state = body.state.trim();
		if (body.postalCode) metadata.postal_code = body.postalCode.trim();
		if (body.country) metadata.country = body.country.trim().toUpperCase();

		// Product-specific metadata
		if (productType === "compatibility_report") {
			const bd1 = body.birthDate1?.trim();
			const bd2 = body.birthDate2?.trim();

			if (!bd1 || !bd2) {
				return NextResponse.json(
					{ error: "Missing birth dates for compatibility report" },
					{ status: 400 },
				);
			}

			metadata.birth_date_1 = bd1;
			metadata.birth_date_2 = bd2;
		}

		// Update Stripe PaymentIntent
		const updatedIntent = await stripe.paymentIntents.update(intentId, {
			receipt_email: email,
			metadata,
			// Optionally update billing details too
			...(body.firstName || body.lastName || body.phone || body.address1
				? {
						shipping: {
							name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
							phone: body.phone?.trim(),
							address: {
								line1: body.address1?.trim(),
								line2: body.address2?.trim(),
								city: body.city?.trim(),
								state: body.state?.trim(),
								postal_code: body.postalCode?.trim(),
								country: body.country?.trim().toUpperCase(),
							},
						},
					}
				: {}),
		});

		console.log(`✅ Payment intent ${intentId} updated with metadata`);

		return NextResponse.json({
			ok: true,
			intentId: updatedIntent.id,
			metadata: updatedIntent.metadata,
		});

	} catch (err: unknown) {
		console.error("Error updating payment intent:", err);

		// Stripe error
		if (err instanceof Stripe.errors.StripeError) {
			if (err.type === "StripeInvalidRequestError") {
				return NextResponse.json(
					{ error: "Invalid payment intent ID or parameters" },
					{ status: 400 },
				);
			}

			return NextResponse.json(
				{ error: err.message || "Stripe error" },
				{ status: 400 },
			);
		}

		// Normal JS Error
		if (err instanceof Error) {
			return NextResponse.json(
				{ error: "Failed to update payment intent", details: err.message },
				{ status: 500 },
			);
		}

		// Fallback (unknown throw)
		return NextResponse.json(
			{ error: "Failed to update payment intent" },
			{ status: 500 },
		);
	}
}
