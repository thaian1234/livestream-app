import { NotificationDTO } from "@/server/api/dtos/notification.dto";

interface NotificationItemProps {
    notification: NotificationDTO.Activity;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const renderNotification = () => {
        switch (notification.type) {
            case "NEW_FOLLOWER":
                return `${notification.actorName} started following you`;
            case "UNFOLLOW":
                return `${notification.actorName} unfollowed you`;
            case "BLOCKED":
                return `${notification.actorName} started streaming`;
            case "stream_end":
                return `${notification.actorName} ended their stream`;
            case "blocked":
                return `${notification.actorName} blocked you`;
            default:
                return "New notification";
        }
    };

    return <div className="notification-item">{renderNotification()}</div>;
};
