import { Button } from "@/components/ui/button";

interface UploadButtonProps {
    isUploading: boolean;
    handleUpload: () => void;
    children: React.ReactNode;
}

export function UploadButton({
    isUploading,
    handleUpload,
    children,
}: UploadButtonProps) {
    return (
        <Button
            variant="default"
            onClick={handleUpload}
            disabled={isUploading}
            type="submit"
        >
            {children}
        </Button>
    );
}
