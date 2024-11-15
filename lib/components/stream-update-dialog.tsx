import { ROUTES } from "../configs/routes.config";
import { streamApi } from "../features/stream/apis";
import { StreamUpdateForm } from "../features/stream/components/local-livescreen/stream-update-form";
import { UploadThumbnailForm } from "../features/upload/components/upload-thumbnail-form";
import { SettingsIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KeyInformation = dynamic(
    () =>
        import("@/lib/features/setting/components/key-update-form").then(
            (form) => form.KeyForm,
        ),
    {
        loading: () => <Spinner />,
        ssr: false,
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
            <DialogContent className="h-[calc(100vh-2rem)] px-10 lg:max-w-3xl">
                <Tabs className="flex flex-col space-y-6">
                    <TabsList className="grid w-full grid-cols-2 gap-x-4 bg-transparent">
                        <TabsTrigger
                            value="information"
                            className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        >
                            Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="key"
                            className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        >
                            Key
                        </TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-8rem)] px-4">
                        <TabsContent value="information" className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Edit Stream Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your stream profile here.
                                    Click save when you&apos;re done.
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
                                    initialImageUrl={
                                        data.data.stream.thumbnailUrl
                                    }
                                />
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="key"
                            className="flex flex-col space-y-4 pb-8"
                        >
                            <Label>Key Information</Label>
                            <KeyInformation hidingUpdateButton />
                            <Link
                                href={ROUTES.KEY_PAGE(username)}
                                className="ml-auto italic underline"
                            >
                                Generate new Key ?
                            </Link>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
