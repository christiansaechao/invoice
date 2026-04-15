function extractFilename(contentDisposition: string | null) {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]).replaceAll('"', "").trim();
  }

  const basicMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return basicMatch?.[1]?.trim() || null;
}

export async function downloadInvoicePdf(
  invoiceId: string,
  accessToken: string,
): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

  const res = await fetch(`${apiUrl}/api/pdf/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message =
      payload && typeof payload.error === "string"
        ? payload.error
        : `PDF generation failed (${res.status})`;

    throw new Error(message);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  const filename =
    extractFilename(res.headers.get("Content-Disposition")) ??
    `Invoice_${invoiceId}.pdf`;

  downloadLink.href = objectUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(objectUrl);
}
