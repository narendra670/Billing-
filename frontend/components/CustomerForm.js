export default function CustomerForm({ customer, onChange, invoiceNo, onInvoiceNoChange, invoiceDate, onInvoiceDateChange }) {
  return (
    <div className="mb-8 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Invoice Meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-800">Invoice Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Invoice No.</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => onInvoiceNoChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-800 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="INV-001"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => onInvoiceDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-800 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-800">Bill To</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => onChange({ ...customer, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
              <input
                type="text"
                value={customer.address}
                onChange={(e) => onChange({ ...customer, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter customer address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
