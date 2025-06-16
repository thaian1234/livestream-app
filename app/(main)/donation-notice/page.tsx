"use client";

import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const orderId = searchParams.orderId || "";
    const { data, isPending, error } = orderApi.query.useGetOrderInfo(
        orderId || "",
    );
    const isSuccess = searchParams.success === "true";

    if (isPending || data === undefined) return <Spinner size={"large"} />;
    if (error && !data?.data) return router.replace(ROUTES.HOME_PAGE);

    return <DonationNotice isSuccess={isSuccess} orderDetails={data.data} />;
}
