import { useEffect, useState } from "react"

export default function PdfPreviewModal({ pdfUrl, onClose }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pdfUrl) {
      setLoading(true)
      const timer = setTimeout(() => setLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [pdfUrl])

  if (!pdfUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download={`invoice-${Date.now()}.pdf`}
              className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition"
            >
              Download
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            >
              &times;
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 p-2 sm:p-4 bg-gray-100 rounded-b-xl">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className={`w-full h-[70vh] rounded-lg border border-gray-200 bg-white ${loading ? "hidden" : ""}`}
              title="PDF Preview"
            />
          )}
        </div>
      </div>
    </div>
  )
}
