import { streamApi } from "../../apis";
import { SettingsIcon } from "lucide-react";

import { useAuth } from "@/lib/providers/auth-provider";

import { StreamDTO } from "@/server/api/dtos/stream.dto";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { StreamUpdateForm } from "./stream-update-form";

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
            <DialogTrigger asChild>
                <Button variant={"default"}>
                    <SettingsIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Stream Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your stream profile here. Click save
                        when you`&apos;`re done.
                    </DialogDescription>
                </DialogHeader>
                {/* Stream Update Form */}
                <StreamUpdateForm
                    initialValues={data.data.stream}
                    username={username}
                />
                {/* <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}
