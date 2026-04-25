import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import { motion, useCycle } from "motion/react"
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";
import { usePendingUploads } from "../store/uploads";

export function UploadWidget() {
  const [isOpen, toggleWidget] = useCycle(false, true)
  const { isPending } = usePendingUploads()

  return (
    <Collapsible.Root onOpenChange={() => toggleWidget()} asChild>
      <motion.div
        data-progress={isPending}
        className="bg-zinc-900 overflow-hidden w-[360px] rounded-xl relative shadow-main data-[state=closed]:rounded-3xl data-[progress=true]:data-[state=closed]:animate-border"
        animate={ isOpen ? 'open' : 'closed'}
        variants={{
          closed: {
            width: 200,
            height: 44, 
          },
          open: { 
            height: 'auto',
          },
        }}
      >
         { !isOpen && <UploadWidgetMinimizedButton /> }
        
        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone  />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content"></div>

            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  );
}
