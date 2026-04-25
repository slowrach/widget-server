import { UploadCloud } from "lucide-react"

export function UploadWidgetTitle() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium">
      <UploadCloud className="text-zinc-400" strokeWidth={1.5} size={16} />
      <span>Upload Files</span>
    </div>
  );
}
