import "@/style/auth.css"

export default function AuthLayout({ children }) {
    return (
        <div className="container">
            <div className="popup">
                {children}
            </div>
        </div>
    )
}