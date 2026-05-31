import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEY ?? process.env.stripe_secret_key;

export function isStripeConfigured(): boolean {
  return !!secretKey;
}

export function getStripe(): Stripe {
  if (!secretKey) {
    throw new Error("Stripe no configurado");
  }
  return new Stripe(secretKey);
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}

export function requiresDeposit(provider: {
  depositEnabled: boolean;
  depositCents: number;
}): boolean {
  return (
    isStripeConfigured() &&
    provider.depositEnabled &&
    provider.depositCents > 0
  );
}
