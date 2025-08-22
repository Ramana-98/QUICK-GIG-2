import { Toast, ToastProvider, ToastViewport } from "./toast"
import { useToast } from "../../hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(function ({ id, title, description, variant, ...props }) {
          return (
            <Toast 
              key={id} 
              id={id}
              title={title}
              description={description}
              variant={variant}
              {...props}
            />
          )
        })}
      </ToastViewport>
    </ToastProvider>
  )
}
