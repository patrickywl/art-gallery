import { Suspense } from "react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "문의하기 | 성은공방",
  description: "작품 문의 및 상담을 받아보세요.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">문의하기</h1>
      <p className="mt-2 text-zinc-500">
        작품에 관심이 있으시거나 궁금한 점이 있으시면 메시지를 남겨주세요.
      </p>
      <Suspense>
        <ContactForm />
      </Suspense>
    </div>
  );
}
