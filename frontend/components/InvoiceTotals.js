export default function InvoiceTotals({ rows }) {
  const totalQty = rows.reduce((sum, r) => sum + (parseInt(r.qty) || 1), 0)
  const subtotal = rows.reduce((sum, r) => {
    const qty = parseInt(r.qty) || 1
    const rate = parseFloat(r.rate) || 0
    return sum + qty * rate
  }, 0)
  const totalDiscount = rows.reduce((sum, r) => {
    const amt = parseFloat(r.amount) || 0
    const pct = parseFloat(r.discount) || 0
    return sum + (amt * pct) / 100
  }, 0)
  const totalGst = rows.reduce((sum, r) => {
    const amt = parseFloat(r.amount) || 0
    const pct = parseFloat(r.gst) || 0
    return sum + (amt * pct) / 100
  }, 0)
  const grandTotal = rows.reduce((sum, r) => {
    const amt = parseFloat(r.amount) || 0
    const pct = parseFloat(r.gst) || 0
    return sum + amt + (amt * pct) / 100
  }, 0)

  const amountInWords = numberToWords(Math.round(grandTotal))

  return (
    <div className="border-t-2 border-gray-300 pt-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Amount in words */}
        <div className="text-xs sm:text-sm text-gray-600 max-w-xs">
          <span className="font-semibold">Amount in Words:</span>
          <p className="italic text-gray-500 mt-0.5">{amountInWords}</p>
        </div>

        {/* Totals */}
        <div className="w-full sm:w-72 space-y-1.5 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-medium">{totalQty}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">&#8377; {subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-red-600">- &#8377; {totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total GST:</span>
            <span className="font-medium">&#8377; {totalGst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-800 mt-1">
            <span>Grand Total:</span>
            <span className="text-blue-700">&#8377; {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function numberToWords(n) {
  if (n === 0) return "Zero Only"

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const convertBelow1000 = (num) => {
    let str = ""
    if (num >= 100) {
      str += ones[Math.floor(num / 100)] + " Hundred "
      num %= 100
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + " "
      num %= 10
    }
    if (num > 0) {
      str += ones[num] + " "
    }
    return str.trim()
  }

  let result = ""
  const crore = Math.floor(n / 10000000)
  n %= 10000000
  const lakh = Math.floor(n / 100000)
  n %= 100000
  const thousand = Math.floor(n / 1000)
  n %= 1000

  if (crore) result += convertBelow1000(crore) + " Crore "
  if (lakh) result += convertBelow1000(lakh) + " Lakh "
  if (thousand) result += convertBelow1000(thousand) + " Thousand "
  if (n) result += convertBelow1000(n) + " "

  return result.trim() + " Only"
}
