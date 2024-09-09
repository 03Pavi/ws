import "./globals.css";
import StoreProvider from "./storeProvider";

interface LayoutProps {
  children: React.ReactNode;
  types: any; // or some specific type
}
const Layout: React.FC<LayoutProps> = ({ children, types }) => {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
export default Layout