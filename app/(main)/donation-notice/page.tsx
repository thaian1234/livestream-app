"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/lib/configs/routes.config";
import { orderApi } from "@/lib/features/order/apis";
import { DonationNotice } from "@/lib/features/order/components/order-notice";

import { Spinner } from "@/components/ui/spinner";

export default function DonationNoticePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderId = searchParams.get("orderId") || "";
    const isSuccess = searchParams.get("success") === "true";

    const { data, isPending, error } = orderApi.query.useGetOrderInfo(orderId);

    useEffect(() => {
        if (error) router.replace(ROUTES.HOME_PAGE);
    }, [error, router]);

    if (isPending || data === undefined) return <Spinner size={"large"} />;

    if (error) return null;

    return <DonationNotice isSuccess={isSuccess} orderDetails={data.data} />;
}
