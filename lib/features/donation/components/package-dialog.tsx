"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

import { ErrorField } from "@/components/error-field";

import { IPackage } from "../types/package";

interface AddPackageDialogProps {
    children: React.ReactNode;
    defaultValue?: IPackage;
}

const packageSchema = z.object({
    packageName: z.string().min(1, "Package name is required"),
    amount: z.preprocess(
        (val) => Number(val),
        z
            .number({ invalid_type_error: "Amount must be a number" })
            .min(1, "Amount must be at least 1"),
    ),
    description: z.string().optional(),
});

export function PackageDialog({
    children,
    defaultValue,
}: AddPackageDialogProps) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
        reset,
    } = useForm<IPackage>({
        resolver: zodResolver(packageSchema),
    });
    const handleOpenChange = (newOpen: boolean) => {
        if (defaultValue) {
            setValue("id", defaultValue.id);
            setValue("packageName", defaultValue.packageName);
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
        console.log("Form data:", data);
    });
    const selectedType = watch("amount");
    console.log(selectedType);
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
                                    {...register("packageName")}
                                    placeholder="e.g. Super Fan"
                                />
                                {errors.packageName && (
                                    <ErrorField>
                                        {errors.packageName.message}
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
                                    {...register("amount")}
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
                            <Button variant={"secondary"}>Add Package</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
