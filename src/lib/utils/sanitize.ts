export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const collapsed = trimmed
    .split("")
    .filter((ch) => ch.charCodeAt(0) > 32)
    .join("")
    .toLowerCase();
  const blocked = ["javascript:", "data:", "vbscript:", "file:"];
  if (blocked.some((scheme) => collapsed.startsWith(scheme))) {
    return "#invalid-url";
  }
  return trimmed;
}

const FORMULA_START = /^[=+\-@\t\r]/;

export function toCsvField(value: string | number | null | undefined): string {
  const raw = String(value ?? "");
  const guarded = FORMULA_START.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const all = [headers, ...rows];
  return "\uFEFF" + all.map((row) => row.map(toCsvField).join(",")).join("\r\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8;"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function toLocalDateInput(d = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
