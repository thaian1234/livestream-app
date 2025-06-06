import "@/style/auth.css";
import Image from "next/image";

import { Background } from "@/lib/features/auth/layouts/background";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Background>
            <main className="containerAuth absolute z-50">
                <Image
                    src="/logo.svg"
                    className="logoContainer"
                    width={100}
                    height={100}
                    alt="Logo"
                />
                <section className="popup">{children}</section>
            </main>
        </Background>
    );
}
