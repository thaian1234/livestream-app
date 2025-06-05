"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/lib/hooks/use-user";

import { DonateCardDTO } from "@/server/api/dtos/donate-card.dto";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ErrorField } from "@/components/error-field";

import { donationApi } from "../apis";

interface AddPackageDialogProps {
    children: React.ReactNode;
    defaultValue?: DonateCardDTO.Select;
}

export function PackageDialog({
    children,
    defaultValue,
}: AddPackageDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: createDonationCard, isPending: createPending } =
        donationApi.mutation.useCreateDonationCard();
    const { mutate: updateDonationCard, isPending: updatePending } =
        donationApi.mutation.useUpdateDonationCard();
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
        reset,
    } = useForm<DonateCardDTO.Insert>({
        resolver: zodResolver(DonateCardDTO.insertSchema),
        defaultValues: {
            streamId: user.stream.id,
        },
    });
    const handleOpenChange = (newOpen: boolean) => {
        if (defaultValue) {
            setValue("id", defaultValue.id);
            setValue("title", defaultValue.title);
            setValue("amount", defaultValue.amount);
            if (defaultValue.description) {
                setValue("description", defaultValue.description);
            }
        }
        setOpen(newOpen);
    };
    // Khi dialog mở, reset lại form
    useEffect(() => {
        if (!open) {
            // Reset lại form khi đóng dialog
            reset();
        }
    }, [open, reset]);

    const onSubmit = handleSubmit((data) => {
        if (defaultValue) {
            updateDonationCard(
                {
                    param: { cardId: defaultValue?.id },
                    json: {
                        ...data,
                    },
                },
                {
                    onSettled() {
                        setOpen(false);
                    },
                },
            );
        } else {
            createDonationCard(
                {
                    json: {
                        ...data,
                    },
                },
                {
                    onSettled() {
                        setOpen(false);
                    },
                },
            );
        }
    });

    const selectedType = watch("amount");
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Donation Package</DialogTitle>
                    <DialogDescription>
                        Create a new donation option
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div className="grid gap-4 py-4">
                            <div className="grid">
                                <Label
                                    htmlFor="package-name"
                                    className="pb-2 text-white"
                                >
                                    Package Name
                                </Label>
                                <Input
                                    {...register("title")}
                                    placeholder="e.g. Super Fan"
                                />
                                {errors.title && (
                                    <ErrorField>
                                        {errors.title.message}
                                    </ErrorField>
                                )}
                            </div>
                            <div className="grid">
                                <Label
                                    htmlFor="Amount (VN)"
                                    className="pb-2 text-white"
                                >
                                    Amount (VNĐ)
                                </Label>
                                <Input
                                    {...register("amount", {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    placeholder="e.g. 100000"
                                />
                                {errors.amount && (
                                    <ErrorField>
                                        {errors.amount.message}
                                    </ErrorField>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="package-description"
                                    className="text-white"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    {...register("description")}
                                    id="package-description"
                                    placeholder="Describe what donors get with this package"
                                />
                                {errors.description && (
                                    <ErrorField>
                                        {errors.description.message}
                                    </ErrorField>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant={"secondary"}
                                loading={createPending || updatePending}
                            >
                                {defaultValue
                                    ? "Update Package"
                                    : "Add Package"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
