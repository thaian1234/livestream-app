import { streamApi } from "../features/stream/apis";
import { StreamUpdateForm } from "../features/stream/components/local-livescreen/stream-update-form";
import { UploadThumbnailForm } from "../features/upload/components/upload-thumbnail-form";
import { SettingsIcon } from "lucide-react";
import dynamic from "next/dynamic";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KeyInformation = dynamic(
    () =>
        import("@/lib/features/setting/components/key-update-form").then(
            (form) => form.KeyForm,
        ),
    {
        loading: () => <Spinner />,
        ssr: false, // Disable server-side rendering for this component
    },
);

interface StreamUpdateDialogProps {
    username: string;
}

export function StreamUpdateDialog({ username }: StreamUpdateDialogProps) {
    const { isPending, data, isError } =
        streamApi.query.useGetStreamInformation(username);

    if (isPending) {
        return <p>Loading information</p>;
    }
    if (isError || !data) {
        return <p>Cannot load form</p>;
    }

    return (
        <Dialog>
            <DialogTrigger>
                <SettingsIcon />
            </DialogTrigger>
            <DialogContent className="px-10 lg:max-w-3xl">
                <Tabs className="flex flex-col space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="information">
                            Information
                        </TabsTrigger>
                        <TabsTrigger value="key">Key</TabsTrigger>
                    </TabsList>
                    <TabsContent value="information" className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit Stream Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your stream profile here. Click
                                save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Stream Update Form */}
                        <StreamUpdateForm
                            initialValues={data.data.stream}
                            username={username}
                        />
                        {/* Stream Upload Image */}
                        <div>
                            <Label>Upload Stream Thumbnail</Label>
                            <UploadThumbnailForm
                                initialImageUrl={data.data.stream.thumbnailUrl}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="key" className="space-y-4">
                        <KeyInformation hidingUpdateButton />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
