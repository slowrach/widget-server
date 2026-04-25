import { useUploads } from "../store/uploads";
import { UploadWidgetUploadItem } from "./upload-widget-item";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export function UploadWidgetUploadList() {
  const uploads = useUploads((store) => store.uploads);

  const isEmpty = uploads.size === 0;

  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">Files</span>

      <ScrollArea.Root
        type="always"
        className="overflow-hidden"
      >
        <ScrollArea.Viewport className="h-[200px]">
          {isEmpty ? (
            <span className="text-xs text-zinc-600 flex items-center justify-center mt-20">No files uploaded</span>
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from(uploads.entries()).map(([uploadId, upload]) => (
                <UploadWidgetUploadItem
                  key={uploadId}
                  upload={upload}
                  uploadId={uploadId}
                />
              ))}
            </div>
          )}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-160 ease-out hover:bg-blackA5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
