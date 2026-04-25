import * as Collapsible from "@radix-ui/react-collapsible";
import { Maximize2 } from "lucide-react";
import { UploadWidgetTitle } from "./upload-widget-title";
import { Button } from "./ui/button";

export function UploadWidgetMinimizedButton() {
  return (
    <div className="w-full h-full px-5 py-3 bg-white/2 flex items-center justify-between">
      <UploadWidgetTitle />

      <Collapsible.Trigger asChild>
         <Button size="icon">
            <Maximize2 strokeWidth={1.5} size={16} />
         </Button>
      </Collapsible.Trigger>
    </div>
  );
}
