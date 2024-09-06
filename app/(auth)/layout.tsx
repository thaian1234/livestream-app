
import "@/style/auth.css"
import logoipsum from '@/public/logoipsum-330.svg';
import next from '@/public/next.svg';
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="container">
            <img src={logoipsum?.src} className="logoContainer" alt="Logo"/>
            <div className="popup">
                {children}
            </div>
        </div>
    )
}