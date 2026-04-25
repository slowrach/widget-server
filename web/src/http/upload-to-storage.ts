import axios from "axios"

interface UploadToStorageParams {
   file: File
   onProgress: (sizeInBytes: number) => void
}

interface Options {
   signal?: AbortSignal
}

export async function uploadToStorage({ file, onProgress }: UploadToStorageParams, option: Options) {
   const data = new FormData()

   data.append('file', file)

   const response = await axios.post<{ url: string}>('http://localhost:3333/uploads', data, {
      headers: {
         'Content-Type': 'multipart/form-data'
      },
      signal: option?.signal,
      onUploadProgress(progressEvent) {
         onProgress(progressEvent.loaded)
      }
   })

   return { url: response.data.url }
}