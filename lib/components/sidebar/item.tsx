interface ItemProps {
    children: React.ReactNode; // Chỉ nhận các component React
    userName: String;
}
export function Item({ children, userName }: ItemProps) {
    return (
        <div className="flex w-full items-center overflow-x-hidden">
            <span className="mr-2">{children}</span>
            <span className="w-full truncate">{userName}</span>
        </div>
    );
}
