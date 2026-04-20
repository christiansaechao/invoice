import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PaymentSection } from "./PaymentSection";
import React from "react";

describe("PaymentSection Component", () => {
  it("renders when status is 'sent' and payment link is provided", () => {
    render(
      <PaymentSection 
        paymentLink="https://pay.me/test" 
        status="sent" 
        total={100} 
        currency="USD"
      />
    );

    expect(screen.getByText(/Ready to pay USD \$100.00\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pay Invoice Now/i })).toHaveAttribute("href", "https://pay.me/test");
    expect(screen.getByText(/Secure payment hosted by Receipts App/i)).toBeInTheDocument();
  });

  it("renders when status is 'overdue'", () => {
    render(
      <PaymentSection 
        paymentLink="https://pay.me/overdue" 
        status="overdue" 
        total={250.75}
      />
    );

    expect(screen.getByText(/Ready to pay USD \$250.75\?/i)).toBeInTheDocument();
  });

  it("does not render when status is 'draft'", () => {
    const { container } = render(
      <PaymentSection 
        paymentLink="https://pay.me/test" 
        status="draft"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when status is 'paid'", () => {
    const { container } = render(
      <PaymentSection 
        paymentLink="https://pay.me/test" 
        status="paid"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when paymentLink is missing", () => {
    const { container } = render(
      <PaymentSection 
        paymentLink={null} 
        status="sent"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
