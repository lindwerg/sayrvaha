import { getSiteSettings } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-serif mb-8">Настройки сайта</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
