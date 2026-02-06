import { writeClient } from "@/lib/sanity-admin";
import type { SiteSettings } from "@/sanity/lib/types";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  heroTitle, telegramBotUrl, instagramUrl, phone, email, address,
  heroImage { asset-> { _id, url } }
}`;

export default async function AdminSettingsPage() {
  const settings = await writeClient.fetch<SiteSettings & { heroImage?: { asset?: { _id: string; url: string } } }>(SETTINGS_QUERY);

  return (
    <div>
      <h1 className="text-2xl font-serif mb-8">Настройки сайта</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
