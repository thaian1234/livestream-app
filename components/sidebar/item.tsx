interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    userName: String;
};
export const ItemInSidebar: React.FC<Props> = ({ children, userName }) => {
    return (
        <div className="flex w-full items-center">
            <span className="mr-2">
                {children}
            </span>
            <span className="truncate w-full">
                {userName}
            </span>
        </div>
    )
}