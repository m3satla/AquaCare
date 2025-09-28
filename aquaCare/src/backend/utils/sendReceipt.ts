import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { User } from "../models/user";
import { Payment } from "../models/payment"; // שים לב שזה אמור להיות מה-Mongoose, לא מ-old

export async function sendReceiptAsPDF(user: User, payment: Partial<Payment> & { _id?: string }) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../../receipts/receipt_${payment._id || "unknown"}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(20).text("קבלה על תשלום", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`שם הלקוח: ${user.firstName} ${user.lastName}`);
  doc.text(`דוא"ל: ${user.email}`);
  doc.text(`תאריך: ${new Date(payment.date || "").toLocaleDateString("he-IL")}`);
  doc.text(`סכום: ₪${payment.amount}`);
  doc.text(`סטטוס: ${payment.status}`);
  doc.text(`אמצעי תשלום: ${payment.method}`);
  doc.end();

await new Promise<void>((resolve) => {
  writeStream.on("finish", () => resolve());
});
    writeStream.on("error", (error) => {
        console.error("שגיאה בכתיבת קובץ PDF:", error);
        throw error;
    });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER!,
    to: user.email,
    subject: "קבלה על תשלום - AquaCare",
    text: `שלום ${user.firstName}, מצורפת קבלה עבור התשלום שבוצע.`,
    attachments: [
      {
        filename: `receipt_${payment._id || "receipt"}.pdf`,
        path: filePath,
      },
    ],
  });

  fs.unlinkSync(filePath); // מחיקה אחרי שליחה
}
