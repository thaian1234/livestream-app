import { ROUTES } from "../configs/routes.config";
import { categoryApi } from "../features/category/apis";
import { SettingUpdateForm } from "../features/setting/components/setting-update-form";
import { streamApi } from "../features/stream/apis";
import { StreamCategoriesForm } from "../features/stream/components/local-livescreen/stream-categories-form";
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

    const tabList = [
        {
            value: "information",
            label: "Information",
            title: "Edit Stream Profile",
            description:
                "Make changes to your stream profile here. Click save when you're done.",
            content: (
                <div className="space-y-4 px-2">
                    {/* Stream Update Form */}
                    <StreamUpdateForm
                        initialValues={data.data.stream}
                        username={username}
                    />
                    {/* Add Categories Form */}
                    <StreamCategoriesForm streamId={data.data.stream.id} />
                    {/* Stream Upload Image */}
                    <div>
                        <Label>Upload Stream Thumbnail</Label>
                        <UploadThumbnailForm
                            initialImageUrl={data.data.stream.thumbnailUrl}
                        />
                    </div>
                </div>
            ),
        },
        {
            value: "key",
            label: "Key",
            title: "Key Information",
            description: "Keep this Key secret",
            content: (
                <div className="flex flex-col space-y-4">
                    <KeyInformation hidingUpdateButton />
                    <Link
                        href={ROUTES.KEY_PAGE(username)}
                        className="ml-auto pr-4 italic underline"
                    >
                        Generate new Key ?
                    </Link>
                </div>
            ),
        },
        {
            value: "chat-setting",
            label: "Chat Setting",
            title: "Chat Setting",
            description: "Update your Chat Setting",
            content: <SettingUpdateForm />,
        },
    ];

    return (
        <Dialog>
            <DialogTrigger>
                <SettingsIcon />
            </DialogTrigger>
            <DialogContent
                className="h-[calc(100vh-4rem)] px-5 lg:max-w-4xl"
                aria-describedby="stream-update-dialog-description"
            >
                <DialogTitle></DialogTitle>
                <Tabs className="flex flex-col space-y-6">
                    <TabsList className="grid w-full grid-cols-3 gap-x-4 bg-transparent">
                        {tabList.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-10rem)] px-4">
                        {tabList.map((tab) => (
                            <TabsContent
                                key={tab.value}
                                value={tab.value}
                                className="space-y-4"
                            >
                                <DialogHeader>
                                    <DialogTitle>{tab.title}</DialogTitle>
                                    <DialogDescription>
                                        {tab.description}
                                    </DialogDescription>
                                </DialogHeader>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
