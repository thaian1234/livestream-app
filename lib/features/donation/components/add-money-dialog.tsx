"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { formatVND } from "@/lib/helpers/currency";
import { useUser } from "@/lib/hooks/use-user";

import { DonationDTO } from "@/server/api/dtos/donation.dto";
import { OrderDTO } from "@/server/api/dtos/order.dto";

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
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { ErrorField } from "@/components/error-field";

import { donationApi } from "../apis";

interface DonateDialogProps {
    children: React.ReactNode;
}

export function AddMoneyDialog({ children }: DonateDialogProps) {
    const [open, setOpen] = useState(false);

    const { user } = useUser();
    const { mutate: createDonation, isPending: isCreatingDonation } =
        donationApi.mutation.useCreateDonation();

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        getValues,
    } = useForm<DonationDTO.DonationRequest & { customAmount?: number }>({
        resolver: zodResolver(DonationDTO.donationRequestSchema),
        defaultValues: {
            paymentMethod: "VNPAY",
            streamerId: user.id,
            amount: 0,
            customAmount: 0,
        },
    });

    const selectedPaymentMethod = watch("paymentMethod");
    const customAmount = watch("customAmount");

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    const getDonationAmount = () => {
        return customAmount || 0;
    };

    const onSubmit = handleSubmit((data) => {
        const amount = getDonationAmount();

        if (amount <= 0) {
            return;
        }

        createDonation(
            {
                json: {
                    streamerId: user.id,
                    cardId: undefined,
                    message: data.message || "",
                    amount: amount,
                    paymentMethod: data.paymentMethod,
                },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            },
        );
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
                <DialogHeader>
                    <DialogTitle>Add money to Wallet</DialogTitle>
                    <DialogDescription>
                        Enter the amount you&apos;d like to add to your wallet.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="customAmount"
                                className="text-white"
                            >
                                Enter Amount (VNĐ)
                            </Label>

                            <MoneyInput
                                value={customAmount || 0}
                                onChange={(value) =>
                                    setValue("customAmount", value)
                                }
                                currency="VND"
                                locale="vi-VN"
                                min={1000}
                                placeholder="Enter amount (minimum 1,000 VNĐ)"
                                className="text-white"
                            />

                            {errors.customAmount && (
                                <ErrorField>
                                    {errors.customAmount.message}
                                </ErrorField>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-white">Payment Method</Label>
                            <RadioGroup
                                value={selectedPaymentMethod}
                                onValueChange={(value) =>
                                    setValue(
                                        "paymentMethod",
                                        value as OrderDTO.PaymentMethod,
                                    )
                                }
                                className="grid grid-cols-1 gap-2"
                            >
                                <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3">
                                    <RadioGroupItem value="VNPAY" id="vnpay" />
                                    <Label
                                        htmlFor="vnpay"
                                        className="flex-1 cursor-pointer"
                                    >
                                        VNPay
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3">
                                    <RadioGroupItem value="MOMO" id="momo" />
                                    <Label
                                        htmlFor="momo"
                                        className="flex-1 cursor-pointer"
                                    >
                                        MoMo
                                    </Label>
                                </div>
                            </RadioGroup>
                            {errors.paymentMethod && (
                                <ErrorField>
                                    {errors.paymentMethod.message}
                                </ErrorField>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    const amount = getDonationAmount();

                                    if (amount <= 0) return;

                                    const payload = getValues();

                                    createDonation(
                                        {
                                            json: {
                                                ...payload,
                                                cardId: undefined,
                                                amount: amount,
                                            },
                                        },
                                        {
                                            onSuccess: ({ data }) => {
                                                setOpen(false);
                                                reset();

                                                window.location.href =
                                                    data.paymentUrl;
                                            },
                                        },
                                    );
                                }}
                                loading={isCreatingDonation}
                                disabled={
                                    getDonationAmount() <= 0 ||
                                    !customAmount ||
                                    customAmount < 1000
                                }
                            >
                                {getDonationAmount() > 0
                                    ? `Deposit ${formatVND(getDonationAmount())}`
                                    : "Deposit"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
