import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { OrderRouteType } from "@/server/api/routes/order.routes";

const baseApi = baseClient<OrderRouteType>().orders;
const baseKey = "orders";

const keys = {
    orders: [baseKey] as string[],
    order_info: (orderId: string) => [baseKey, orderId] as string[],
};

export const orderApi = {
    query: {
        useGetOrderInfo(orderId: string) {
            const $get = baseApi[":id"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.order_info(orderId),
                {
                    param: {
                        id: orderId,
                    },
                },
                {
                    enabled: !!orderId,
                },
            );
        },
    },
    mutation: {},
};
