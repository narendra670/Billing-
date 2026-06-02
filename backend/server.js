const express = require("express")
const cors = require("cors")
const PDFDocument = require("pdfkit")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())

app.post("/api/generate-pdf", (req, res) => {
  const { customer, items, totals } = req.body

  const doc = new PDFDocument({ margin: 40, size: "A4" })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf")
  doc.pipe(res)

  // Colors
  const primary = "#1e3a5f"
  const accent = "#2563eb"
  const gray = "#6b7280"

  // Header
  doc.fontSize(22).font("Helvetica-Bold").fillColor(primary).text("GANESH BHANDAR", { align: "center" })
  doc.moveDown(0.3)

  // Divider
  doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor("#d1d5db").lineWidth(1).stroke()
  doc.moveDown(0.5)

  // Business Info
  doc.fontSize(9).font("Helvetica").fillColor(gray)
  const infoY = doc.y
  doc.text(`GST No: xxxxx`, 40, infoY)
  doc.text(`Account No: xxxxx`, 40, infoY + 12)
  doc.text(`Address: xxxxxxxxxx`, 300, infoY)
  doc.text(`Phone: xxxxxxxxxx`, 300, infoY + 12)
  doc.moveDown(2)

  // Customer
  doc.fontSize(11).font("Helvetica-Bold").fillColor(primary).text("Bill To:", 40, doc.y)
  doc.fontSize(10).font("Helvetica").fillColor("#374151")
  doc.text(`Name: ${customer.name || "N/A"}`, 40, doc.y + 2)
  doc.text(`Address: ${customer.address || "N/A"}`, 40, doc.y + 2)
  doc.moveDown(1.5)

  // Invoice date
  const now = new Date()
  doc.fontSize(9).fillColor(gray).text(`Date: ${now.toLocaleDateString("en-IN")}`, 400, 140, { align: "right" })
  doc.moveDown(1)

  // Table Header
  const tableTop = doc.y
  const colWidths = [28, 130, 70, 70, 60, 60, 72]
  const headers = ["S.No", "Product", "Batch", "Expiry", "Disc%", "GST%", "Amount"]

  // Draw table header background
  doc.rect(40, tableTop, 520, 18).fill(primary)
  doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff")
  let xPos = 40
  headers.forEach((h, i) => {
    doc.text(h, xPos + 3, tableTop + 4, { width: colWidths[i], align: i > 3 ? "right" : "left" })
    xPos += colWidths[i]
  })

  // Table Rows
  let rowY = tableTop + 18
  items.forEach((item, idx) => {
    if (rowY > 720) {
      doc.addPage()
      rowY = 40
    }

    const bgColor = idx % 2 === 0 ? "#f9fafb" : "#ffffff"
    doc.rect(40, rowY, 520, 18).fill(bgColor)
    doc.fontSize(8).font("Helvetica").fillColor("#374151")

    const values = [
      String(item.serial),
      item.product || "-",
      item.batch || "-",
      item.expire || "-",
      item.discount || "0",
      item.gst || "0",
      (parseFloat(item.amount) || 0).toFixed(2),
    ]

    xPos = 40
    values.forEach((v, i) => {
      doc.text(v, xPos + 3, rowY + 4, {
        width: colWidths[i],
        align: i > 3 ? "right" : "left",
      })
      xPos += colWidths[i]
    })

    rowY += 18
  })

  // Totals
  rowY += 10
  if (rowY > 700) {
    doc.addPage()
    rowY = 40
  }

  doc.rect(350, rowY, 210, 60).fill("#f3f4f6")
  doc.fontSize(9).font("Helvetica")
  doc.fillColor("#374151").text("Total Amount:", 360, rowY + 8, { width: 100 })
  doc.fillColor(primary).font("Helvetica-Bold").text(`₹ ${(totals.totalAmount || 0).toFixed(2)}`, 460, rowY + 8, { width: 90, align: "right" })

  doc.font("Helvetica").fillColor("#374151").text("Total GST:", 360, rowY + 24, { width: 100 })
  doc.font("Helvetica-Bold").fillColor(primary).text(`₹ ${(totals.totalGst || 0).toFixed(2)}`, 460, rowY + 24, { width: 90, align: "right" })

  // Grand Total
  doc.rect(350, rowY + 40, 210, 22).fill(accent)
  doc.font("Helvetica-Bold").fillColor("#ffffff").fontSize(11).text("Grand Total:", 360, rowY + 44, { width: 100 })
  doc.text(`₹ ${(totals.grandTotal || 0).toFixed(2)}`, 460, rowY + 44, { width: 90, align: "right" })

  // Footer
  doc.font("Helvetica").fillColor(gray).fontSize(8)
  doc.text("Thank you for your business!", 40, 750, { align: "center", width: 520 })
  doc.text("Ganesh Bhandar", 40, 762, { align: "center", width: 520 })

  doc.end()
})

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Billing backend is running" })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
