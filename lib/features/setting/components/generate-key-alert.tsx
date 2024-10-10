import { MessageCircleWarningIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface GenerateKeyAlertProps {
    isPending: boolean;
    onSubmit: () => void;
}

export function GenerateKeyAlert({
    isPending,
    onSubmit,
}: GenerateKeyAlertProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex justify-end">
                    <Button
                        variant="gradient"
                        disabled={isPending}
                        className="text-black-0"
                    >
                        Generate
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Generate your Stream Key
                    </AlertDialogTitle>
                    <Alert className="space-x-6 border-2 border-yellow-200/60">
                        <MessageCircleWarningIcon
                            className="size-8"
                            color="yellow"
                        />
                        <AlertTitle>Warning !</AlertTitle>
                        <AlertDescription>
                            Your Stream Key will only be available for 1 week.
                            Please ensure you save it securely as it cannot be
                            retrieved later. Generating a new key will
                            invalidate the previous one.
                        </AlertDescription>
                    </Alert>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
