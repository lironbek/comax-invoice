// InvoiceModel Types and Builder

export interface InvoiceItem {
  name: string;
  code: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  itemInfo: string;
  promotion: boolean;
}

export interface InvoicePayment {
  methodName: string;
  amount: number;
  paymentCode: string;
  paymentInfo: string;
  comments: string;
}

export interface InvoiceModel {
  // Header / Meta
  invoiceId: string;
  receiptNumber: string;
  createdAt: string;
  companyName: string;    // BusinessID
  branchName: string;     // BranchID
  posNumber: string;      // PosId
  cashierName: string;
  cashierId: string;
  customerName: string;
  customerId: string;
  customerPhone: string;
  customerEmail: string;
  reference: string;
  barcode: string;        // Barcode field for barcode image

  // Totals / Summary
  currency: string;
  total: number;
  totalNoVat: number;
  vatAmount: number;
  vatPercent: number;
  discount: number;
  itemsCount: number;

  // Items
  items: InvoiceItem[];

  // Payments
  payments: InvoicePayment[];

  // Extra / Optional
  action: number | null;
  receiptType: number | null;
  paymentType: number | null;
  paymentTypeStr: string | null;
  additionalData: unknown[];
  notes: string;
}

export interface BuildResult {
  model: InvoiceModel | null;
  warnings: string[];
  error: string | null;
}

// Helper to safely convert to number
function toNumber(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

// Helper to safely get string
function toString(value: unknown, fallback: string = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

// Helper to trim string
function toTrimmedString(value: unknown, fallback: string = ""): string {
  return toString(value, fallback).trim();
}

// Build InvoiceModel from raw JSON object
export function buildInvoiceModelFromJson(rawJson: unknown): BuildResult {
  const warnings: string[] = [];
  
  // Validate input is an object
  if (!rawJson || typeof rawJson !== 'object') {
    return {
      model: null,
      warnings: [],
      error: "הנתונים שהוזנו אינם אובייקט JSON תקין"
    };
  }

  const json = rawJson as Record<string, unknown>;

  // Validate Items array
  if (!Array.isArray(json.Items)) {
    return {
      model: null,
      warnings: [],
      error: "חסר Items או שהוא לא תקין - Items חייב להיות מערך"
    };
  }

  // Check Total validity
  const totalRaw = json.Total;
  let total = 0;
  if (totalRaw === null || totalRaw === undefined || isNaN(Number(totalRaw))) {
    warnings.push("Total לא תקין, הוגדר ל-0");
  } else {
    total = Number(totalRaw);
  }

  // Build customer name with fallback logic
  let customerName = toString(json.LoyalName, "");
  if (!customerName) {
    const firstName = toString(json.first_name, "");
    const lastName = toString(json.last_name, "");
    if (firstName || lastName) {
      customerName = `${firstName} ${lastName}`.trim();
    }
  }

  // Build customer email with fallback
  let customerEmail = toString(json.email, "");
  if (!customerEmail) {
    customerEmail = toString(json.send_to, "");
  }

  // Build receiptNumber with fallback
  let receiptNumber = toString(json.TransactionNumber, "");
  if (!receiptNumber) {
    receiptNumber = toString(json.Barcode, "");
  }

  // Build createdAt with fallback
  let createdAt = toString(json.CreatedDate, "");
  if (!createdAt) {
    createdAt = toString(json.UploadedDate, "");
  }

  // Build totalNoVat with fallback
  let totalNoVat = toNumber(json.TotalNoVat, 0);
  if (json.TotalNoVat === null || json.TotalNoVat === undefined) {
    totalNoVat = toNumber(json.vat_liable, 0);
  }

  // Build items
  const items: InvoiceItem[] = (json.Items as unknown[]).map((item: unknown) => {
    const itemObj = item as Record<string, unknown>;
    const quantity = toNumber(itemObj.Quantity, 1);
    const unitPrice = toNumber(itemObj.Price, 0);
    const lineTotal = toNumber(itemObj.Total, quantity * unitPrice);

    return {
      name: toString(itemObj.Name, ""),
      code: toTrimmedString(itemObj.Code, ""),
      quantity,
      unitPrice,
      lineTotal,
      itemInfo: toString(itemObj.ItemInfo, ""),
      promotion: Boolean(itemObj.Promotion)
    };
  });

  // Build payments
  const payments: InvoicePayment[] = Array.isArray(json.Payments)
    ? (json.Payments as unknown[]).map((p: unknown) => {
        const pObj = p as Record<string, unknown>;
        return {
          methodName: toString(pObj.Name, ""),
          amount: toNumber(pObj.Amount, 0),
          paymentCode: toString(pObj.PaymentCode, ""),
          paymentInfo: toString(pObj.PaymentInfo, ""),
          comments: toString(pObj.Comments, "")
        };
      })
    : [];

  // Calculate itemsCount
  let itemsCount = toNumber(json.ItemsCount, 0);
  if (!itemsCount) {
    itemsCount = items.length;
  }

  const model: InvoiceModel = {
    // Header / Meta
    invoiceId: toString(json.ID, ""),
    receiptNumber,
    createdAt,
    companyName: toString(json.BusinessID, ""),
    branchName: toString(json.BranchID, ""),
    posNumber: toString(json.PosId, ""),
    cashierName: toString(json.CashierName, ""),
    cashierId: toString(json.CashierID, ""),
    customerName,
    customerId: toString(json.LoyaltyID, ""),
    customerPhone: toString(json.Target, ""),
    customerEmail,
    reference: toString(json.Reference, ""),
    barcode: toString(json.Barcode, ""),

    // Totals / Summary
    currency: toString(json.Currency, "שקל"),
    total,
    totalNoVat,
    vatAmount: toNumber(json.Vat, 0),
    vatPercent: toNumber(json.VatTotal, 0),
    discount: toNumber(json.Discount, 0),
    itemsCount,

    // Items
    items,

    // Payments
    payments,

    // Extra / Optional
    action: json.Action !== null && json.Action !== undefined ? Number(json.Action) : null,
    receiptType: json.ReceiptType !== null && json.ReceiptType !== undefined ? Number(json.ReceiptType) : null,
    paymentType: json.PaymentType !== null && json.PaymentType !== undefined ? Number(json.PaymentType) : null,
    paymentTypeStr: json.PaymentTypeStr !== null && json.PaymentTypeStr !== undefined ? String(json.PaymentTypeStr) : null,
    additionalData: Array.isArray(json.AdditionalData) ? json.AdditionalData : [],
    notes: toString(json.notes, "")
  };

  return {
    model,
    warnings,
    error: null
  };
}
