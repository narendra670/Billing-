export default function InvoiceTable({ rows, onRowChange, onRemoveRow, onAddRow }) {
  const calculateRowGst = (amount, gstPct) => {
    const amt = parseFloat(amount) || 0
    const pct = parseFloat(gstPct) || 0
    return (amt * pct) / 100
  }

  const calculateRowTotal = (amount, gstPct) => {
    const amt = parseFloat(amount) || 0
    const pct = parseFloat(gstPct) || 0
    return amt + (amt * pct) / 100
  }

  return (
    <div className="mb-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-1.5 py-2 text-center w-8">#</th>
              <th className="px-1.5 py-2 text-left min-w-[100px]">Product Name</th>
              <th className="px-1.5 py-2 text-left min-w-[80px]">Batch</th>
              <th className="px-1.5 py-2 text-center min-w-[85px]">Expire Date</th>
              <th className="px-1.5 py-2 text-right min-w-[60px]">Qty</th>
              <th className="px-1.5 py-2 text-right min-w-[65px]">Rate</th>
              <th className="px-1.5 py-2 text-right min-w-[65px]">Disc %</th>
              <th className="px-1.5 py-2 text-right min-w-[60px]">GST %</th>
              <th className="px-1.5 py-2 text-right min-w-[70px]">GST Amt</th>
              <th className="px-1.5 py-2 text-right min-w-[70px]">Total</th>
              <th className="px-1.5 py-2 text-center w-8 no-print">Act</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const gstAmt = calculateRowGst(row.amount, row.gst)
              const rowTotal = calculateRowTotal(row.amount, row.gst)
              return (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-1.5 py-1.5 text-center font-medium text-gray-600 text-[11px]">{row.serial}</td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="text"
                      value={row.product}
                      onChange={(e) => onRowChange(index, "product", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="Product name"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="text"
                      value={row.batch}
                      onChange={(e) => onRowChange(index, "batch", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="Batch"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="date"
                      value={row.expire}
                      onChange={(e) => onRowChange(index, "expire", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={row.qty}
                      onChange={(e) => onRowChange(index, "qty", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] text-right focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="1"
                      min="1"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={row.rate}
                      onChange={(e) => onRowChange(index, "rate", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] text-right focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={row.discount}
                      onChange={(e) => onRowChange(index, "discount", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] text-right focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={row.gst}
                      onChange={(e) => onRowChange(index, "gst", e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-[11px] text-right focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-1.5 py-1.5 text-right font-medium text-gray-700 text-[11px]">
                    {gstAmt > 0 ? `₹${gstAmt.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-1.5 py-1.5 text-right font-semibold text-gray-800 text-[11px]">
                    ₹{rowTotal.toFixed(2)}
                  </td>
                  <td className="px-1.5 py-1.5 text-center no-print w-8">
                    <button
                      onClick={() => onRemoveRow(index)}
                      className="text-red-400 hover:text-red-600 font-bold text-base leading-none transition-colors"
                      title="Remove row"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={onAddRow}
        className="mt-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors no-print"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </button>
    </div>
  )
}
