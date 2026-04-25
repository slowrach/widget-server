import { useDropzone } from "react-dropzone";
import { CircularProgressBar } from "./ui/circular-progress-bar";
import { useUploads, usePendingUploads } from "../store/uploads";

export function UploadWidgetDropzone() {
   const addUploads = useUploads(store => store.addUploads)
   const uploadsSize = useUploads(store => store.uploads.size)
   const { isPending, globalPercentage } = usePendingUploads()

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      multiple: true,
      accept: {
         'image/jpeg': [],
         'image/png': []
      },
      onDrop(acceptedFiles) {
         addUploads(acceptedFiles)
      }
   })

   return (
      <div className="px-3 flex flex-col gap-3">
         <div {...getRootProps()} data-active={isDragActive} className="cursor-pointer text-zinc-400 bg-black/20 p-5 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col items-center justify-center gap-1 hover:border-zinc-500 transition-colors data-[active=true]:bg-zinc-400/10 data-[active=true]:border-zinc-500">
            <input type="file" {...getInputProps()} />

            {isPending ? (
               <div className="flex flex-col gap-2 items-center">
                  <CircularProgressBar progress={globalPercentage} size={56} strokeWidth={4} />
                  <span className="text-xxs">Uploading {uploadsSize} files...</span>
               </div>
            ) : (
               <div className="flex flex-col gap-2 items-center">
                  <span className="text-xs">Drop your files here or </span>
                  <span className="text-xs underline">click to select</span>
               </div>
            )
         }
         </div>

         <span className="text-xxs text-zinc-400 text-center">Only .JPG and .PNG images are supported</span>
      </div>
   )
}