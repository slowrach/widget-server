import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { enableMapSet } from "immer";
import { uploadToStorage } from "../http/upload-to-storage";
import { compressImage } from "../utils/compress-image";

export type Upload = {
  name: string;
  file: File;
  abortController?: AbortController;
  status: "uploading" | "completed" | "error" | "canceled";
  compressedSize?: number;
  originalSize: number;
  uploadedSize: number;
  remoteUrl?: string
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (file: File[]) => void;
  cancelUpload: (uploadId: string) => void;
  retryUpload: (uploadId: string) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [["zustand/immer", never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      set((state) => {
        state.uploads.set(uploadId, { ...upload, ...data });
      });
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;
      
      const abortController = new AbortController();

      updateUpload(uploadId, {
        abortController,
        uploadedSize: 0,
        remoteUrl: undefined,
        compressedSize: undefined,
        status: "uploading",
      });

      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8,
        })

        updateUpload(uploadId, { compressedSize: compressedFile.size });

        const { url } = await uploadToStorage(
          {
            file: compressedFile,
            onProgress: (sizeInBytes) => {
              updateUpload(uploadId, { uploadedSize: sizeInBytes });
            },
          },
          { signal: abortController.signal },
        );
        
        updateUpload(uploadId, { status: "completed", remoteUrl: url });

      } catch {
        updateUpload(uploadId, { status: "error" });
      }
    }

    function retryUpload(uploadId: string) {
      processUpload(uploadId);
    }

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      upload.abortController?.abort();

      set((state) => {
        state.uploads.set(uploadId, { ...upload, status: "canceled" });
      });
    }

    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID();

        const upload: Upload = {
          name: file.name,
          file,
          status: "uploading",
          originalSize: file.size,
          uploadedSize: 0,
        };

        set((state) => {
          state.uploads.set(uploadId, upload);
        });

        processUpload(uploadId);
      }
    }

    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
      retryUpload,
    };
  }),
);

export const usePendingUploads = () => {
  return useUploads(
    useShallow((store) => {
      const isPending = Array.from(store.uploads.values()).some(
        (upload) => upload.status === "uploading",
      );

      if (!isPending) {
        return { isPending, globalPercentage: 100 };
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          if (upload.compressedSize) {
            acc.uploaded += upload.uploadedSize;
          }
          
          acc.total += upload.compressedSize || upload.originalSize;
          
          return acc;
        },
        { total: 0, uploaded: 0 },
      );

      const globalPercentage = Math.min(
        Math.round((uploaded / total) * 100),
        100,
      );

      return { isPending, globalPercentage };
    }),
  );
};
