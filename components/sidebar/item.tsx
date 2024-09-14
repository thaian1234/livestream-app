type Props = {
    Avatar: React.ElementType; // Chỉ nhận các component React
    userName: String;
};
export const ItemInSidebar: React.FC<Props> = ({ Avatar, userName }) => {
    return (
        <div className="flex w-full items-center">
            <span className="mr-2">
                <Avatar />
            </span>
            <span className="truncate w-full">
                {userName}
            </span>
        </div>
    )
}