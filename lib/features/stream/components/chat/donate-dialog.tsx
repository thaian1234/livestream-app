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
        console.log("Selected package ID:", value);
        setSelectedPackageId(value);
    };
    const handleDonate = () => {
        if (customAmount !== "") {
            //submit customAmount và customMessage nếu có
        }
        //submit pkg và customMessage nếu có
    };
    console.log(packages);
    return (
        <Dialog>
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

                    <ScrollArea className="mt-4 box-border max-h-[42vh] overflow-y-auto">
                        <TabsContent
                            value="packages"
                            className="w-full min-w-0"
                        >
                            <RadioGroup
                                value={selectedPackageId || undefined}
                                onValueChange={handlePackageChange}
                                className="w-full min-w-0"
                            >
                                <div className="grid w-full gap-4">
                                    {packages && packages.length > 0 ? (
                                        packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                className="flex w-full min-w-0 items-center gap-2"
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
                                                    <div className="flex min-w-0 flex-col">
                                                        <div className="truncate text-sm text-white">
                                                            {/* Tiêu đề hoặc nội dung dòng đầu */}
                                                            gyufe euhe iue iehf
                                                            dhbc udhch ueh ue
                                                        </div>
                                                        <div className="truncate text-sm text-gray-400">
                                                            {pkg.description}
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 text-lg font-bold text-teal-2">
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
                                            <h3 className="mb-2 text-base font-medium">
                                                No donation packages available
                                            </h3>
                                            <p className="mb-4 text-sm text-gray-400">
                                                Create your first donation
                                                package to get started
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
                    </ScrollArea>
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
