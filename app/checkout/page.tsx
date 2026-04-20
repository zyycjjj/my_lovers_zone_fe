import { Suspense } from "react";
import { CheckoutClientPage } from "./checkout-client";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <CheckoutClientPage />
    </Suspense>
  );
}
