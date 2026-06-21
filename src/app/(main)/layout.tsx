import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { getSiteSettings } from "@/lib/data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const cartEnabled = !!settings?.cartEnabled;

  return (
    <CartProvider enabled={cartEnabled}>
      <div className="flex flex-col min-h-screen">
        <Header cartEnabled={cartEnabled} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
