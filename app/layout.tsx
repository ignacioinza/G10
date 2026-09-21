import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pampa Racing Team",
  description: "Sitio oficial de Pampa Racing Team. Equipo, competencias y pilotos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
