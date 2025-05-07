import Header from "../components/Header";
import Footer from "../components/Footer";
import '../lib/i18n';
import "../../src/app/globals.scss";
import { AuthProvider } from "../components/AuthContext";
import { CartProvider } from "../components/CartContext"; // ajuste si le chemin est différent
import { Kosugi_Maru } from "next/font/google";

const kosugiMaru = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Cici Artworks",
  description: "Artworks gallery",
  icons: {
    icon: "/favicon-32x32", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={kosugiMaru.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <div id="drawer-root" />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
