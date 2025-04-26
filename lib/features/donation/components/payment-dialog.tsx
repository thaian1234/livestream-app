"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Children, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ErrorField } from "@/components/error-field";

import { IPaymentMethod } from "../types/payment";

const paymentTypes = ["Bank", "VNPay", "ZaloPay", "Other"];
const paymentSchema = z
    .object({
        type: z.string().min(1, "Payment type is required"),
        bankName: z.string().optional(),
        accountName: z.string().min(1, "Account name is required"),
        accountNumber: z.string().min(1, "Account number is required"),
    })
    .superRefine((data, ctx) => {
        if (data.type === "Bank" && !data.bankName) {
            ctx.addIssue({
                path: ["bankName"],
                code: "custom",
                message: "Bank name is required for bank payment",
            });
        }
    });

interface PaymentDialogProps {
    defaultValue?: IPaymentMethod;
    children: React.ReactNode;
}

export function PaymentDialog({ children, defaultValue }: PaymentDialogProps) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
        reset,
    } = useForm<IPaymentMethod>({
        resolver: zodResolver(paymentSchema),
    });
    const handleOpenChange = (newOpen: boolean) => {
        if (defaultValue) {
            setValue("id", defaultValue.id);
            setValue("type", defaultValue.type);
            setValue("accountName", defaultValue.accountName);
            setValue("accountNumber", defaultValue.accountNumber);
            setValue("bankName", defaultValue.bankName);
        }
        setOpen(newOpen);
    };
    const onSubmit = handleSubmit((data) => {
        console.log("Form data:", data);
    });

    // Khi dialog mở, reset lại form
    useEffect(() => {
        if (!open) {
            // Reset lại form khi đóng dialog
            reset();
        }
    }, [open, reset]);
    const selectedType = watch("type");
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Payment Method</DialogTitle>
                    <DialogDescription>
                        Add a new way to donate
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 items-start gap-4">
                            <div className="grid">
                                <Label htmlFor="type" className="pb-2">
                                    Payment Type
                                </Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentTypes.map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && (
                                    <ErrorField>
                                        {errors.type.message}
                                    </ErrorField>
                                )}
                            </div>
                            {selectedType === "Bank" && (
                                <div className="grid">
                                    <Label htmlFor="bank-name" className="pb-2">
                                        Bank Name
                                    </Label>
                                    <Input
                                        {...register("bankName")}
                                        id="bank-name"
                                        placeholder="Bank name"
                                    />
                                    {errors.bankName && (
                                        <ErrorField>
                                            {errors.bankName.message}
                                        </ErrorField>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 items-start gap-4">
                            <div className="grid">
                                <Label htmlFor="account-name" className="pb-2">
                                    Account Name
                                </Label>
                                <Input
                                    {...register("accountName")}
                                    id="account-name"
                                    placeholder="Account holder name"
                                />
                                {errors.accountName && (
                                    <ErrorField>
                                        {errors.accountName.message}
                                    </ErrorField>
                                )}
                            </div>
                            <div className="grid">
                                <Label
                                    htmlFor="account-number"
                                    className="pb-2"
                                >
                                    Account Number
                                </Label>
                                <Input
                                    {...register("accountNumber")}
                                    id="account-number"
                                    placeholder="Account number"
                                />
                                {errors.accountNumber && (
                                    <ErrorField>
                                        {errors.accountNumber.message}
                                    </ErrorField>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant={"secondary"} type="submit">
                                Add Payment Method
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
