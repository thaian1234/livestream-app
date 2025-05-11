"use client";

import { Gift, Plus } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { donationApi } from "@/lib/features/donation/apis";
import { PackageDialog } from "@/lib/features/donation/components/package-dialog";
import { useUser } from "@/lib/hooks/use-user";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface DonateDialogProps {
    children: ReactNode;
}
export function DonateDialog({ children }: DonateDialogProps) {
    const { user } = useUser();
    const { data, error, isPending } = donationApi.query.useGetDonationCard(
        user.stream.id,
    );
    const packages = data?.data.donateCards;

    const [customMessage, setCustomMessage] = useState("");
    const [customAmount, setCustomAmount] = useState("");

    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
        null,
    );
    const handlePackageChange = (value: string) => {
        setSelectedPackageId(value);
    };
    const handleDonate = () => {
        if (customAmount !== "") {
            //submit customAmount và customMessage nếu có
        }
        //submit pkg và customMessage nếu có
        setOpen(false);
    };
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    useEffect(() => {
        if (!open) {
            // Reset lại form khi đóng dialog
            setSelectedPackageId(null);
            setCustomMessage("");
            setCustomAmount("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Donate</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Support the streamer with a donation
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="packages" className="w-full min-w-0">
                    <TabsList className="bg-white/10">
                        <TabsTrigger value="packages">Packages</TabsTrigger>
                        <TabsTrigger value="custom">Custom Amount</TabsTrigger>
                    </TabsList>

                    <TabsContent value="packages" className="w-full min-w-0">
                        <div className="scrollbar-thin mt-4 max-h-[42vh] overflow-y-auto pr-1">
                            <RadioGroup
                                value={selectedPackageId || undefined}
                                onValueChange={handlePackageChange}
                                className="space-y-4"
                            >
                                {packages && packages.length > 0 ? (
                                    packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            className="flex items-center justify-between gap-1 rounded-md border border-gray-700 p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value={pkg.id}
                                                    id={pkg.id}
                                                    className="border-gray-600 text-teal-2"
                                                />
                                                <div className="flex flex-col">
                                                    <Label
                                                        htmlFor={pkg.id}
                                                        className="font-medium text-white"
                                                    >
                                                        {pkg.title}
                                                    </Label>
                                                    <p className="mt-1 line-clamp-1 text-sm text-gray-300">
                                                        {pkg.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="whitespace-nowrap font-semibold text-teal-2">
                                                {pkg.amount.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="mb-4 rounded-full bg-gray-800 p-3">
                                            <Gift className="h-8 w-8 text-teal-2" />
                                        </div>
                                        <h3 className="mb-2 text-base font-medium">
                                            No donation packages available
                                        </h3>
                                        <p className="mb-4 text-sm text-gray-400">
                                            Create your first donation package
                                            to get started
                                        </p>
                                        <PackageDialog>
                                            <Button className="flex items-center gap-2 bg-teal-2 text-white hover:bg-teal-2">
                                                <Plus className="h-4 w-4" />
                                                Add Package
                                            </Button>
                                        </PackageDialog>
                                    </div>
                                )}
                            </RadioGroup>
                        </div>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-white">
                                Amount (VNĐ)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) =>
                                    setCustomAmount(e.target.value)
                                }
                                className="border-gray-700 bg-gray-800 text-white focus-visible:ring-0"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                        Message (Optional)
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Add a message with your donation"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="min-h-0 border-gray-700 bg-gray-800 text-white focus-visible:ring-0"
                        rows={2}
                    />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        size={"sm"}
                        variant={"gradient"}
                        onClick={() => handleDonate()}
                        disabled={!selectedPackageId && !customAmount}
                    >
                        Donate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
