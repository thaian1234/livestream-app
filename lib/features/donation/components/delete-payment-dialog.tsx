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

interface DeletePaymentProps {
    children: React.ReactNode;
    paymentId: string;
}

export function DeletePaymentDialog({
    children,
    paymentId,
}: DeletePaymentProps) {
    const handleDelete = () => {
        // Call the delete function here
        console.log("Deleting payment method with ID:", paymentId);
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                    <Alert className="space-x-6">
                        <AlertDescription>
                            Are you sure you want to delete this payment method?
                            This action cannot be undone.
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
