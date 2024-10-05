import { UploadImageForm } from "@/lib/features/upload/components/upload-image-form";
import { UploadThumbnailForm } from "@/lib/features/upload/components/upload-thumbnail-form";

export default function UploadPage() {
    return (
        <div className="flex w-[600px] flex-col space-y-4 bg-white">
            <UploadImageForm />
            <UploadThumbnailForm />
        </div>
    );
}
