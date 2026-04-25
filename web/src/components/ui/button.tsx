import { Merge } from "../../utils/merge"
import { Slot } from "@radix-ui/react-slot"

type Props = React.ComponentProps<'button'> & {
   size?: 'default' | 'icon' | 'iconSm'
   asChild?: boolean
}

const variantsButton = {
   default: 'px-3 py-2',
   icon: 'p-2',
   iconSm: 'p-1'
}

export function Button({ size = 'default', className, asChild,...rest } : Props) {
   const Component = asChild ? Slot : 'button'

   return (
      <Component className={Merge(["text-zinc-400 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none", className, variantsButton[size]])} {...rest} />
   )
}