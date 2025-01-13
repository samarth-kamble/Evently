"use server";

import { stripe } from "@/lib/stripe";

export async function createStripeConnectLoginLink(stripAccountId: string) {
  if (!stripAccountId) {
    throw new Error("Strip account ID is required");
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(stripAccountId);

    return loginLink.url;
  } catch (error) {
    console.error("Error creating Stripe Connect login link:", error);
    throw new Error("Failed to create Stripe Connect login link");
  }
}
