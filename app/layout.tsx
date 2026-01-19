import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SAP支払条件（OBB8）提案ツール",
    description: "日本の商習慣に対応したSAP支払条件テンプレート提案ツール",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
