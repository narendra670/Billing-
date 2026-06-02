export default function InvoiceHeader() {
  return (
    <div className="border-b-2 border-gray-800 pb-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Ganesh Bhandar
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Tax Invoice / Bill of Supply</p>
        </div>
        <div className="text-right">
          <p className="text-xl sm:text-2xl font-bold text-gray-800">INVOICE</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs sm:text-sm text-gray-600">
        <div className="space-y-0.5">
          <p><span className="font-semibold">GST No:</span> 07ABCDE1234F1Z5</p>
          <p><span className="font-semibold">Account No:</span> 123456789012</p>
          <p><span className="font-semibold">IFSC Code:</span> SBIN0001234</p>
        </div>
        <div className="sm:text-right space-y-0.5">
          <p><span className="font-semibold">Address:</span> Main Market, Near Bus Stand, City - 123456</p>
          <p><span className="font-semibold">Phone:</span> +91 98765 43210</p>
          <p><span className="font-semibold">Email:</span> ganeshbhandar@email.com</p>
        </div>
      </div>
    </div>
  )
}
