import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsappFab } from "@/components/site/whatsapp-fab";
import { CookieBanner } from "@/components/site/cookie-banner";
import { GoogleAnalytics } from "@/components/site/google-analytics";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsappFab />
      <CookieBanner />
      <GoogleAnalytics />
    </>
  );
}
