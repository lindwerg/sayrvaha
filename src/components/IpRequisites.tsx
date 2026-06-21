import type { SiteSettings } from "@/lib/types";

// Реквизиты ИП. variant="block" — для страниц (контакты/оферта),
// variant="inline" — компактная строка для подвала.
export default function IpRequisites({
  settings,
  variant = "block",
  className = "",
}: {
  settings: Pick<SiteSettings, "ipName" | "ipInn" | "ipOgrnip" | "ipAddress"> | null;
  variant?: "block" | "inline";
  className?: string;
}) {
  if (!settings) return null;
  const { ipName, ipInn, ipOgrnip, ipAddress } = settings;
  if (!ipName && !ipInn && !ipOgrnip && !ipAddress) return null;

  if (variant === "inline") {
    const parts = [
      ipName,
      ipInn ? `ИНН ${ipInn}` : null,
      ipOgrnip ? `ОГРНИП ${ipOgrnip}` : null,
      ipAddress,
    ].filter(Boolean);
    return <p className={className}>{parts.join(" · ")}</p>;
  }

  return (
    <div className={className}>
      {ipName && <p className="text-foreground">{ipName}</p>}
      {ipInn && <p className="text-muted text-sm">ИНН: {ipInn}</p>}
      {ipOgrnip && <p className="text-muted text-sm">ОГРНИП: {ipOgrnip}</p>}
      {ipAddress && <p className="text-muted text-sm">Адрес: {ipAddress}</p>}
    </div>
  );
}
