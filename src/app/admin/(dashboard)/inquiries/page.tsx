"use client";

import { useEffect, useState } from "react";
import { getInquiries, markInquiryRead, type Inquiry } from "@/lib/inquiries";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    getInquiries()
      .then(setInquiries)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (!inquiry.is_read) {
      try {
        await markInquiryRead(inquiry.id);
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === inquiry.id ? { ...i, is_read: true } : i
          )
        );
      } catch {
        // ignore
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">문의 내역</h1>
      <p className="mt-1 text-sm text-zinc-500">
        방문자가 보낸 문의를 확인하세요
      </p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          불러오는 중...
        </div>
      ) : inquiries.length === 0 ? (
        <p className="mt-12 text-center text-zinc-400">
          아직 문의가 없습니다.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* List */}
          <div className="space-y-2">
            {inquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => handleSelect(inquiry)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selected?.id === inquiry.id
                    ? "border-zinc-900 dark:border-white"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {!inquiry.is_read && (
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    {inquiry.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(inquiry.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {inquiry.subject}
                </p>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <span className="text-xs text-zinc-400">
                  {new Date(selected.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium text-zinc-500">보낸 사람:</span>{" "}
                  {selected.name}
                </p>
                <p>
                  <span className="font-medium text-zinc-500">이메일:</span>{" "}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {selected.email}
                  </a>
                </p>
              </div>
              <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {selected.message}
              </div>
              <div className="mt-6">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  답장하기
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
