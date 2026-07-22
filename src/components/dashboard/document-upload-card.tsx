"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function DocumentUploadCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const { notify } = useToast();

  function setMockFile(name: string) {
    setFileName(name);
    notify({
      title: "Document attached",
      description: `${title} is ready for review.`,
    });
  }

  return (
    <div className="rounded-lg border border-banking-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-banking-muted">{description}</p>
      </div>
      {fileName ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-emerald-800">Uploaded</p>
              <p className="mt-1 break-all text-sm text-emerald-700">{fileName}</p>
            </div>
            <button
              onClick={() => setFileName("")}
              className="text-emerald-700 hover:text-emerald-900"
              title="Remove document"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="grid min-h-52 w-full place-items-center rounded-md border border-dashed border-banking-border bg-banking-offWhite p-6 text-center transition hover:border-banking-blue hover:bg-blue-50"
        >
          <div>
            <UploadCloud className="mx-auto h-10 w-10 text-banking-blue" />
            <p className="mt-3 font-semibold">Upload {title}</p>
            <p className="mt-2 text-sm text-banking-muted">
              PDF, PNG, or JPG up to 10MB.
            </p>
          </div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            setMockFile(file.name);
          }
        }}
      />
      <button
        onClick={() => setMockFile(`${title.toLowerCase().replaceAll(" ", "-")}.pdf`)}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-banking-border bg-white px-3 py-2 text-sm font-semibold text-banking-text"
      >
        <FileText className="h-4 w-4" />
        Use sample file
      </button>
    </div>
  );
}
