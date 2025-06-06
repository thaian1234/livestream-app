"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { formatVND } from "@/lib/helpers/currency";

import { DonationDTO } from "@/server/api/dtos/donation.dto";
import { OrderDTO } from "@/server/api/dtos/order.dto";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { ErrorField } from "@/components/error-field";

import { donationApi } from "../apis";

interface DonateDialogProps {
    children: React.ReactNode;
    streamerId?: string;
}

export function DonateDialog({ children, streamerId = "" }: DonateDialogProps) {
    const [open, setOpen] = useState(false);

    const { data: donationCardsData, isLoading: isLoadingCards } =
        donationApi.query.useGetDonationCardByStreamer(streamerId);
    const { mutate: createDonation, isPending: isCreatingDonation } =
        donationApi.mutation.useCreateDonation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        getValues,
    } = useForm<DonationDTO.DonationRequest>({
        resolver: zodResolver(DonationDTO.donationRequestSchema),
        defaultValues: {
            paymentMethod: "VNPAY",
            streamerId: streamerId,
            amount: 0,
        },
    });

    const selectedCardId = watch("cardId");
    const selectedPaymentMethod = watch("paymentMethod");
    const donationCards = donationCardsData?.data.donateCards;

    useEffect(() => {
        if (donationCards && donationCards?.length > 0 && !selectedCardId) {
            setValue("cardId", donationCards?.[0].id);
        }
    }, [donationCardsData, setValue, selectedCardId]);

    if (isLoadingCards || donationCards === undefined)
        return <Spinner size="small" />;

    const selectedCard = donationCards.find(
        (card) => card.id === selectedCardId,
    );

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    const onSubmit = handleSubmit((data) => {
        if (!selectedCard) return;

        createDonation(
            {
                json: {
                    streamerId,
                    cardId: data.cardId,
                    message: data.message || "",
                    amount: selectedCard.amount,
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
            <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl sm:max-w-[500px] lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Support this Streamer</DialogTitle>
                    <DialogDescription>
                        Choose a donation package and payment method
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-5">
                        {isLoadingCards ? (
                            <div className="py-4 text-center">
                                Loading donation packages...
                            </div>
                        ) : donationCards?.length === 0 ? (
                            <div className="py-4 text-center">
                                No donation packages available
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-2 py-2">
                                    <Label className="text-white">
                                        Select a Donation Package
                                    </Label>
                                    <div className="grid max-h-[500px] grid-cols-1 overflow-y-auto pr-2">
                                        <RadioGroup
                                            value={selectedCardId}
                                            onValueChange={(value) =>
                                                setValue("cardId", value)
                                            }
                                        >
                                            {donationCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <RadioGroupItem
                                                        value={card.id}
                                                        id={card.id}
                                                    />
                                                    <Card
                                                        className={`flex-1 cursor-pointer rounded-lg border ${
                                                            selectedCardId ===
                                                            card.id
                                                                ? "border-primary"
                                                                : "border-gray-700"
                                                        }`}
                                                        onClick={() =>
                                                            setValue(
                                                                "cardId",
                                                                card.id,
                                                            )
                                                        }
                                                    >
                                                        <CardHeader className="py-1">
                                                            <CardTitle>
                                                                {card.title}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {formatVND(
                                                                    card.amount,
                                                                )}
                                                            </CardDescription>
                                                        </CardHeader>
                                                        {card.description && (
                                                            <CardContent className="py-1 text-sm">
                                                                {
                                                                    card.description
                                                                }
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    {errors.cardId && (
                                        <ErrorField>
                                            {errors.cardId.message}
                                        </ErrorField>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="message"
                                        className="text-white"
                                    >
                                        Message (Optional)
                                    </Label>
                                    <Textarea
                                        {...register("message")}
                                        id="message"
                                        placeholder="Add a message to the streamer..."
                                        className="resize-none"
                                    />
                                    {errors.message && (
                                        <ErrorField>
                                            {errors.message.message}
                                        </ErrorField>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-white">
                                        Payment Method
                                    </Label>
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
                                        {/* <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3">
                                            <RadioGroupItem
                                                value="WALLET"
                                                id="wallet"
                                            />
                                            <Label
                                                htmlFor="wallet"
                                                className="flex-1 cursor-pointer"
                                            >
                                                From Wallet
                                                <span className="ml-2 text-sm text-gray-400">
                                                    (Balance:{" "}
                                                    {formatVND(
                                                        user?.wallet?.balance ||
                                                            0,
                                                    )}{" "}
                                                    VNĐ)
                                                </span>
                                            </Label>
                                        </div> */}
                                        <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3">
                                            <RadioGroupItem
                                                value="VNPAY"
                                                id="vnpay"
                                            />
                                            <Label
                                                htmlFor="vnpay"
                                                className="flex-1 cursor-pointer"
                                            >
                                                VNPay
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3">
                                            <RadioGroupItem
                                                value="MOMO"
                                                id="momo"
                                            />
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
                            </>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    if (!selectedCard) return;

                                    const payload = getValues();

                                    createDonation(
                                        {
                                            json: {
                                                ...payload,
                                                amount: selectedCard.amount,
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
                                disabled={!selectedCardId || isLoadingCards}
                            >
                                {selectedCard
                                    ? `Donate ${formatVND(selectedCard.amount)}`
                                    : "Donate"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
