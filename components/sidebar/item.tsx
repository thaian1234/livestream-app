interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    userName: String;
}
export function Item({ children, userName }: Props) {
    return (
        <div className="flex w-full items-center">
            <span className="mr-2">{children}</span>
            <span className="w-full truncate">{userName}</span>
        </div>
    );
}
