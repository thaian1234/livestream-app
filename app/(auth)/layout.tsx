
import "@/style/auth.css"
import logoipsum from '@/public/logoipsum-330.svg';
import next from '@/public/next.svg';
import Image from 'next/image';
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="container">
            <Image src={logoipsum?.src} className="logoContainer" width={100} height={100} alt="Logo"/>
            <div className="popup">
                {children}
            </div>
        </div>
    )
}