"use client";

import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { orderApi } from "@/lib/features/order/apis";
import { DonationNotice } from "@/lib/features/order/components/order-notice";

import { Spinner } from "@/components/ui/spinner";

export default function DonationNoticePage({
    searchParams,
}: {
    searchParams: {
        success?: string;
        orderId?: string;
        amount?: string;
        date?: string;
        paymentMethod?: string;
    };
}) {
    const orderId = searchParams.orderId || "";
    const { data, isPending, isError } = orderApi.query.useGetOrderInfo(
        orderId || "",
    );
    const isSuccess = searchParams.success === "true";

    if (isError) return redirect(ROUTES.HOME_PAGE);

    if (isPending || data === undefined) return <Spinner size={"large"} />;

    return <DonationNotice isSuccess={isSuccess} orderDetails={data.data} />;
}
