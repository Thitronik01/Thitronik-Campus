import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Login | THITRONIK Campus 2.0",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
