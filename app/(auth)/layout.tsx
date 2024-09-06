
import "@/style/auth.css"
import Image from 'next/image';
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="containerAuth">
            <Image src="/logoipsum-330.svg" className="logoContainer" width={100} height={100} alt="Logo"/>
            <div className="popup">
                {children}
            </div>
        </div>
    )
}