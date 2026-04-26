import { Suspense } from "react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact | Atelier",
  description: "Get in touch about artworks or commissions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-zinc-500">
        Interested in a piece or have a question? Drop me a message.
      </p>
      <Suspense>
        <ContactForm />
      </Suspense>
    </div>
  );
}
