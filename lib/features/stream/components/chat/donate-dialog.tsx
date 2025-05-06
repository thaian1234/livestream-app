"use client";

import { Gift, Plus } from "lucide-react";
import { ReactNode, useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface DonateDialogProps {
    children: ReactNode;
}
export function DonateDialog({ children }: DonateDialogProps) {
    const { user } = useUser();
    const [donationMessage, setDonationMessage] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const { data, error, isPending } = donationApi.query.useGetDonationCard(
        user.stream.id,
    );

    const packages = data?.data.donateCards;
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    // const handleDonate = (dialogClose: () => void) => {
    //     const amount = selectedPackage
    //         ? donationPackages.find(
    //               (pkg) => pkg.id.toString() === selectedPackage,
    //           )?.amount
    //         : Number.parseFloat(customAmount);

    //     if (!amount) return;

    //     // Add donation message to chat
    //     setMessages([
    //         ...messages,
    //         {
    //             id: messages.length + 1,
    //             sender: "System",
    //             content: `💰 You donated $${amount}${donationMessage ? `: "${donationMessage}"` : ""}`,
    //             avatar: "/placeholder.svg?height=40&width=40",
    //         },
    //     ]);

    //     // Reset form
    //     setSelectedPackage(null);
    //     setCustomAmount("");
    //     setDonationMessage("");

    //     // Close dialog
    //     dialogClose();
    // };
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md border-gray-700 bg-[#1a1a2e] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Donate</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Support the streamer with a donation
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="packages">
                    <TabsList className="bg-white/10">
                        <TabsTrigger value="packages">Packages</TabsTrigger>
                        <TabsTrigger value="custom">Custom Amount</TabsTrigger>
                    </TabsList>

                    <TabsContent value="packages" className="mt-4">
                        <RadioGroup
                        // value={selectedPackage || ""}
                        // onValueChange={setSelectedPackage}
                        >
                            <div className="grid gap-4">
                                {packages ? (
                                    packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                value={pkg.id.toString()}
                                                id={`package-${pkg.id}`}
                                                className="border-gray-600 text-teal-2"
                                            />
                                            <Label
                                                htmlFor={`package-${pkg.id}`}
                                                className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-gray-700 p-4 hover:bg-gray-800"
                                            >
                                                <div>
                                                    <div className="text-sm text-gray-400">
                                                        {pkg.description}
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-teal-2">
                                                    {pkg.amount.toLocaleString(
                                                        "vi-VN",
                                                    )}{" "}
                                                    VNĐ
                                                </div>
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="mb-4 rounded-full bg-gray-800 p-3">
                                            <Gift className="h-8 w-8 text-teal-2" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-medium">
                                            No donation packages available
                                        </h3>
                                        <p className="mb-4 text-gray-400">
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
                            </div>
                        </RadioGroup>
                    </TabsContent>
                    <TabsContent value="custom" className="mt-4 space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-white">
                                Amount ($)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) =>
                                    setCustomAmount(e.target.value)
                                }
                                className="border-gray-700 bg-gray-800 text-white"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="mt-4 space-y-2">
                    <Label htmlFor="message" className="text-white">
                        Message (Optional)
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Add a message with your donation"
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                    />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        // onClick={() => handleDonate(close)}
                        disabled={!selectedPackage && !customAmount}
                        className="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                    >
                        Donate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
