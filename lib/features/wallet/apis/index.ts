import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { WalletRouteType } from "@/server/api/routes/wallet.routes";

const baseApi = baseClient<WalletRouteType>().wallets;

const keys = {
    baseKey: ["wallet"],
    my_wallet: ["wallet", "my"] as string[],
    my_wallet_transaction: ["wallet", "my", "transaction"] as string[],
    my_wallet_recent_transaction: [
        "wallet",
        "my",
        "recent",
        "transaction",
    ] as string[],
};

export const walletApi = {
    query: {
        useGetMyWallet() {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.my_wallet, {
                staleTime: 30000,
                refetchInterval: 60000,
            });
        },
        useGetMyWalletTransactions() {
            const $get = baseApi.transactions.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.my_wallet,
                {
                    query: {
                        page: "1",
                        size: "10",
                    },
                },
                {
                    staleTime: 30000,
                    refetchInterval: 60000,
                },
            );
        },
        useGetWalletWithRecentTransactions(limit: string) {
            const $get = baseApi.recent.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.my_wallet_transaction,
                {
                    query: {
                        limit,
                    },
                },
                {
                    staleTime: 30000,
                    refetchInterval: 60000,
                },
            );
        },
    },
    mutation: {},
};
