export const metadata = {
  title: "FDL Tournament Centre",
  description: "FDL Tournament admin/public live panel powered by Supabase",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}