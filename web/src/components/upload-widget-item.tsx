import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import type { Upload } from "../store/uploads";
import { useUploads } from "../store/uploads";
import { downloadUrl } from "../utils/download-url";

interface UploadWidgetUploadItemProps {
  upload: Upload;
  uploadId: string;
}

export function UploadWidgetUploadItem({ upload, uploadId }: UploadWidgetUploadItemProps) {
  const cancelUpload = useUploads((store) => store.cancelUpload);
  const retryUpload = useUploads((store) => store.retryUpload);

  const progress = Math.min(
    upload.compressedSize ? Math.round((upload.uploadedSize / upload.compressedSize) * 100) : 0, 
    100
  )

  return (
    <div className="p-3 rounded-lg flex flex-col gap-3 shadow-content bg-white/2 relative overflow-hidden">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp size={12} className="text-zinc-300" strokeWidth={1.5} />
          <span className="max-w-[180px] truncate">{upload.name}</span>
        </span>

        <span className="text-xxs flex items-center gap-1.5 text-zinc-400">
          {(upload.originalSize / 1024).toFixed(1)} KB
          <div className="size-1 rounded-full bg-zinc-700"></div>
          {upload.status === "uploading" && (
            <span className="font-medium">{progress}%</span>
          )}
          {upload.status === "completed" && (
            <span className="text-green-500 font-medium">Completed</span>
          )}
          {upload.status === "error" && (
            <span className="text-red-600 font-medium">Error</span>
          )}
          {upload.status === "canceled" && (
            <span className="text-yellow-400 font-medium">Canceled</span>
          )}
        </span>

        <Progress.Root
          data-status={upload.status}
          className="group bg-zinc-800 rounded-full h-1 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <Progress.Indicator
              className={`bg-green-500 group-data-[status=error]:bg-red-500 group-data-[status=canceled]:bg-transparent h-1 transition-all`}
              style={{ width: upload.status === "uploading" ? `${progress}%` : "100%" }}
            />
          </motion.div>
        </Progress.Root>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button size="iconSm" aria-disabled={!upload.remoteUrl} asChild onClick={() => {
            if (upload.remoteUrl) {
              downloadUrl(upload.remoteUrl)
            }
          }}>
          <a href={upload.remoteUrl}>
            <Download size={16} strokeWidth={1.5} />
            <span className="sr-only">Download compressed image</span>
          </a>
        </Button>

        <Button size="iconSm" disabled={!upload.remoteUrl} onClick={() => upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl)}>
          <Link2 size={16} strokeWidth={1.5} />
          <span className="sr-only">Copy link</span>
        </Button>

        <Button
          size="iconSm"
          disabled={upload.status !== "error" && upload.status !== "canceled"}
          onClick={() => retryUpload(uploadId)}
        >
          <RefreshCcw size={16} strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button
          size="iconSm"
          onClick={() => cancelUpload(uploadId)}
          disabled={upload.status !== "uploading"}
        >
          <X size={16} strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </div>
  );
}
