import { useState, useEffect, useCallback } from "react"

let toastId = 0
let addToastFn = null

export function addToast(message, type = "success", duration = 4000) {
  if (addToastFn) {
    addToastFn({ id: ++toastId, message, type, duration })
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    addToastFn = (toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => removeToast(toast.id), toast.duration)
    }
    return () => {
      addToastFn = null
    }
  }, [removeToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-slide-in
            ${t.type === "success" ? "bg-green-600 text-white" : ""}
            ${t.type === "error" ? "bg-red-600 text-white" : ""}
            ${t.type === "info" ? "bg-blue-600 text-white" : ""}
            ${t.type === "warning" ? "bg-amber-600 text-white" : ""}
          `}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>
      ))}
    </div>
  )
}
