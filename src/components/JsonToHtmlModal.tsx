import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, FileCode, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { buildInvoiceModelFromJson, BuildResult } from "@/lib/invoiceModel";
import { generateInvoiceHtml, convertImagesToBase64 } from "@/lib/invoiceHtmlGenerator";
import { InvoiceSettings } from "./InvoiceInterface";
import { toast } from "sonner";

interface JsonToHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InvoiceSettings;
}

const SAMPLE_JSON = `{
  "ID": "d68fdd24-1f2f-44e4-aa4c-9fadf9c4d0a0",
  "OriginalText": null,
  "Total": 13.9,
  "TotalNoVat": 11.78,
  "VatTotal": 18,
  "Vat": 2.12,
  "Currency": "שקל",
  "Discount": "0.0000",
  "Barcode": "1012103319",
  "BusinessID": "",
  "PosId": "12",
  "BranchID": "2",
  "Action": 1,
  "TransactionNumber": "1012103319",
  "ReceiptType": 1,
  "PaymentType": 0,
  "PaymentTypeStr": null,
  "ExtraDiscreteField1": null,
  "ExtraDiscreteField2": null,
  "ExtraTextField1": null,
  "ExtraTextField2": null,
  "LoyaltyID": null,
  "LoyalName": "לקוחות מזדמנים-112000",
  "CashierName": "נועה מלול",
  "CashierID": "6906",
  "AgentName": "",
  "AgentID": "0",
  "MoneySaved": 0,
  "ItemsCount": "2",
  "OrderID": null,
  "CreatedDate": "2025-12-15T14:02:30",
  "UploadedDate": "2025-12-15T14:02:52",
  "Items": [
    {
      "Name": "iphone 15 plus מגן לטלפון",
      "Price": 3,
      "Quantity": 1,
      "Code": "9720000623962                 ",
      "Total": 3,
      "ItemInfo": "",
      "Promotion": false
    },
    {
      "Name": "סט 4 מגשים עגולים 35.5 CM",
      "Price": 10.9,
      "Quantity": 1,
      "Code": "9720000604886                 ",
      "Total": 10.9,
      "ItemInfo": "",
      "Promotion": false
    }
  ],
  "Payments": [
    {
      "Name": "אשראי",
      "PaymentCode": "5",
      "Amount": 13.9,
      "PaymentInfo": "*****1868",
      "Comments": "תשלומים:1"
    }
  ],
  "AdditionalData": [],
  "Target": "0502457889",
  "prescriptions": null,
  "resend": false,
  "vat_liable": 11.78,
  "not_vat_liable": 0,
  "late_delivery": false,
  "delivery_from_store": null,
  "previous_credit_line": null,
  "previous_outstanding_balance": null,
  "current_purchase": null,
  "current_outstanding_balance": null,
  "current_credit_line": null,
  "sub_bid": "28",
  "first_name": null,
  "last_name": null,
  "email": null,
  "send_to": null,
  "full_address": null,
  "delivery_details": null,
  "notes": null,
  "Reference": ""
}`;

export default function JsonToHtmlModal({ isOpen, onClose, settings }: JsonToHtmlModalProps) {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setParseError("");
    setBuildResult(null);
    setGeneratedHtml("");
    setIsGenerating(true);

    // Try to parse JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonInput);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "שגיאה לא ידועה";
      setParseError(`שגיאה בפענוח JSON: ${errorMessage}`);
      setIsGenerating(false);
      return;
    }

    // Build InvoiceModel
    const result = buildInvoiceModelFromJson(parsedJson);
    setBuildResult(result);

    if (result.error) {
      setIsGenerating(false);
      return;
    }

    if (result.model) {
      try {
        // Convert images to Base64 for portability
        const settingsWithBase64 = await convertImagesToBase64(settings);
        
        // Generate HTML
        const html = generateInvoiceHtml(result.model, settingsWithBase64);
        setGeneratedHtml(html);
      } catch (err) {
        console.error('Error generating HTML:', err);
        setParseError("שגיאה ביצירת ה-HTML");
      }
    }
    
    setIsGenerating(false);
  };

  const handleCopyHtml = async () => {
    if (!generatedHtml) return;
    
    try {
      await navigator.clipboard.writeText(generatedHtml);
      toast.success("HTML הועתק ללוח!");
    } catch {
      toast.error("שגיאה בהעתקה ללוח");
    }
  };

  const handleDownloadHtml = () => {
    if (!generatedHtml) return;
    
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${buildResult?.model?.receiptNumber || 'export'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("הקובץ הורד בהצלחה!");
  };

  const handleReset = () => {
    setJsonInput(SAMPLE_JSON);
    setBuildResult(null);
    setGeneratedHtml("");
    setParseError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <FileCode className="w-5 h-5" />
            המרת JSON לחשבונית HTML
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4 p-1">
          {/* JSON Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">הדבק JSON של חשבונית:</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-xs h-64 resize-none"
              dir="ltr"
              placeholder="הדבק כאן את ה-JSON..."
            />
          </div>

          {/* Error Messages */}
          {parseError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          {buildResult?.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{buildResult.error}</AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {buildResult?.warnings && buildResult.warnings.length > 0 && (
            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {buildResult.warnings.map((w, i) => (
                  <div key={i}>{w}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Success + Generated HTML */}
          {generatedHtml && (
            <>
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  HTML נוצר בהצלחה! לחץ על "העתק HTML" כדי להעתיק.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">תצוגה מקדימה של הקוד:</label>
                <div className="bg-gray-100 rounded border p-3 max-h-48 overflow-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all" dir="ltr">
                    {generatedHtml.substring(0, 2000)}
                    {generatedHtml.length > 2000 && "..."}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleGenerate} className="flex-1" disabled={isGenerating}>
            <FileCode className="w-4 h-4 ml-2" />
            {isGenerating ? "מייצר..." : "צור HTML"}
          </Button>
          
          {generatedHtml && (
            <>
              <Button onClick={handleCopyHtml} variant="secondary" className="flex-1">
                <Copy className="w-4 h-4 ml-2" />
                העתק HTML
              </Button>
              <Button onClick={handleDownloadHtml} variant="secondary" className="flex-1">
                <Download className="w-4 h-4 ml-2" />
                הורד קובץ
              </Button>
            </>
          )}
          
          <Button onClick={handleReset} variant="outline">
            איפוס
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
