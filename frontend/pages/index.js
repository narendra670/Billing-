import Head from "next/head"
import { useState, useRef, useCallback } from "react"
import axios from "axios"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import InvoiceHeader from "../components/InvoiceHeader"
import CustomerForm from "../components/CustomerForm"
import InvoiceTable from "../components/InvoiceTable"
import InvoiceTotals from "../components/InvoiceTotals"
import ActionButtons from "../components/ActionButtons"
import PdfPreviewModal from "../components/PdfPreviewModal"
import ToastContainer, { addToast } from "../components/Toast"

export default function Home() {
  const today = new Date().toISOString().split("T")[0]
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [invoiceDate, setInvoiceDate] = useState(today)

  const [rows, setRows] = useState([
    { serial: 1, product: "", batch: "", expire: "", qty: "1", rate: "", discount: "", gst: "", amount: "" },
  ])

  const [customer, setCustomer] = useState({ name: "", address: "" })
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const formRef = useRef(null)

  const addRow = () => {
    setRows([...rows, { serial: rows.length + 1, product: "", batch: "", expire: "", qty: "1", rate: "", discount: "", gst: "", amount: "" }])
  }

  const removeRow = (index) => {
    if (rows.length === 1) return
    const updated = rows.filter((_, i) => i !== index).map((r, i) => ({ ...r, serial: i + 1 }))
    setRows(updated)
  }

  const handleRowChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value

    if (field === "qty" || field === "rate") {
      const qty = parseInt(updated[index].qty) || 1
      const rate = parseFloat(updated[index].rate) || 0
      updated[index].amount = (qty * rate).toString()
    }

    setRows(updated)
  }

  const generatePdfBlob = useCallback(async () => {
    const input = formRef.current
    if (!input) return null

    // Clone the invoice DOM so we don't alter the live page
    const clone = input.cloneNode(true)

    // Replace all inputs with plain spans so html2canvas renders values reliably
    const inputs = clone.querySelectorAll("input")
    inputs.forEach((inp) => {
      const span = document.createElement("span")
      span.textContent = inp.value || inp.placeholder || ""
      span.style.cssText = getComputedStyle(inp).cssText
      span.style.display = "inline-block"
      span.style.minWidth = `${inp.offsetWidth}px`
      span.style.color = getComputedStyle(inp).color || "#374151"
      inp.parentNode.replaceChild(span, inp)
    })

    // Remove no-print elements (Add Item button, action buttons, etc.)
    clone.querySelectorAll(".no-print").forEach((el) => el.remove())

    // Temporarily insert clone off-screen for capture
    clone.style.position = "absolute"
    clone.style.left = "-9999px"
    clone.style.top = "0"
    document.body.appendChild(clone)

    const fullCanvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    document.body.removeChild(clone)

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const margin = 8
    const imgWidth = pageWidth - margin * 2
    const pxPerMm = fullCanvas.width / imgWidth

    let yPx = 0
    let pageNum = 0

    while (yPx < fullCanvas.height) {
      if (pageNum > 0) pdf.addPage()

      const pageHeightPx = Math.round(pageHeight * pxPerMm)
      const sliceHeight = Math.min(pageHeightPx, fullCanvas.height - yPx)

      const pageCanvas = document.createElement("canvas")
      pageCanvas.width = fullCanvas.width
      pageCanvas.height = sliceHeight
      const ctx = pageCanvas.getContext("2d")
      ctx.drawImage(fullCanvas, 0, yPx, fullCanvas.width, sliceHeight, 0, 0, fullCanvas.width, sliceHeight)

      const pageImgData = pageCanvas.toDataURL("image/png")
      const sliceHeightMm = sliceHeight / pxPerMm

      pdf.addImage(pageImgData, "PNG", margin, margin, imgWidth, sliceHeightMm)

      yPx += pageHeightPx
      pageNum++
    }

    return pdf.output("blob")
  }, [])

  const handlePreview = async () => {
    if (!customer.name) {
      addToast("Please enter customer name first", "warning")
      return
    }
    if (rows.length === 0 || !rows[0].product) {
      addToast("Please add at least one product", "warning")
      return
    }

    setIsGenerating(true)
    try {
      const blob = await generatePdfBlob()
      if (blob) {
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        setShowPreview(true)
        addToast("PDF preview ready", "success")
      }
    } catch (err) {
      addToast("Failed to generate PDF preview", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!customer.name) {
      addToast("Please enter customer name first", "warning")
      return
    }
    if (rows.length === 0 || !rows[0].product) {
      addToast("Please add at least one product", "warning")
      return
    }

    setIsGenerating(true)
    try {
      const blob = await generatePdfBlob()
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `invoice-${invoiceNo || Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
        addToast("PDF downloaded successfully!", "success")
      }
    } catch (err) {
      try {
        const payload = {
          customer,
          items: rows,
          totals: getTotals(),
          invoiceNo,
          invoiceDate,
        }
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf`, payload, {
          responseType: "blob",
        })
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `invoice-${invoiceNo || Date.now()}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        addToast("PDF downloaded from server!", "success")
      } catch (backendErr) {
        addToast("Failed to generate PDF. Check backend server.", "error")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    if (!customer.name) {
      addToast("Please enter customer name first", "warning")
      return
    }
    window.print()
  }

  const closePreview = () => {
    setShowPreview(false)
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }

  const getTotals = () => {
    const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
    const totalGst = rows.reduce((sum, r) => {
      const amt = parseFloat(r.amount) || 0
      const pct = parseFloat(r.gst) || 0
      return sum + (amt * pct) / 100
    }, 0)
    const grandTotal = totalAmount + totalGst
    return { totalAmount, totalGst, grandTotal }
  }

  return (
    <>
      <Head>
        <title>Billing Software</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <ToastContainer />

      <div ref={formRef} className="print-area max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-3 sm:p-4 md:p-6">
        <InvoiceHeader />

        <CustomerForm
          customer={customer}
          onChange={setCustomer}
          invoiceNo={invoiceNo}
          onInvoiceNoChange={setInvoiceNo}
          invoiceDate={invoiceDate}
          onInvoiceDateChange={setInvoiceDate}
        />

        <InvoiceTable
          rows={rows}
          onRowChange={handleRowChange}
          onRemoveRow={removeRow}
          onAddRow={addRow}
        />

        <InvoiceTotals rows={rows} />

        {/* Terms */}
        <div className="border-t border-gray-200 pt-3 mb-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">Terms & Conditions:</p>
          <p>1. Goods once sold will not be taken back or exchanged.</p>
          <p>2. All disputes subject to local jurisdiction.</p>
          <p>3. This is a computer generated invoice.</p>
        </div>

        {/* Signature */}
        <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-700">Customer Signature</p>
            <div className="mt-8 w-40 border-t border-gray-300"></div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <p className="font-semibold text-gray-700">For Ganesh Bhandar</p>
            <div className="mt-8 w-40 border-t border-gray-300 ml-auto"></div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute pointer-events-none select-none"> </div>
      </div>

      {/* Actions */}
      <div className="max-w-6xl mx-auto mt-4 sm:mt-6">
        <ActionButtons
          onDownloadPdf={handleDownloadPdf}
          onPrint={handlePrint}
          onPreview={handlePreview}
          isGenerating={isGenerating}
        />
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 no-print">Ganesh Bhandar - Billing Software v2.0</p>

      {showPreview && pdfUrl && (
        <PdfPreviewModal pdfUrl={pdfUrl} onClose={closePreview} />
      )}
    </div>
    </>
  )
}
