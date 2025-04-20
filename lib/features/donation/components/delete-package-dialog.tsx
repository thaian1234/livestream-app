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

interface DeletePackageProps {
    children: React.ReactNode;
    packageId: string;
}

export function DeletePackageDialog({
    children,
    packageId,
}: DeletePackageProps) {
    const handleDelete = () => {
        // Call the delete function here
        console.log("Deleting package with ID:", packageId);
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Package</AlertDialogTitle>
                    <Alert className="space-x-6">
                        <AlertDescription>
                            Are you sure you want to delete this package? This
                            action cannot be undone.
                        </AlertDescription>
                    </Alert>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete()}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
