"use client";
import { generateUploadToken  } from "@/lib/helpers/user";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  uploadToken: string;
}

export default function UploadButton({ uploadToken }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("sharex", file);
    formData.append("x-clippy-upload-token", uploadToken);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(`Upload failed: ${data.message}`);
        return;
      }

      const fileUrl = `${data.url}/${data.path}`;
      await navigator.clipboard.writeText(fileUrl);
      alert(`Uploaded! URL copied:\n${fileUrl}`);
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        <Upload className="size-4" />
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </>
  );
}
