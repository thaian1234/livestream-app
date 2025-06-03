import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { DonationRouteType } from "@/server/api/routes/donation.routes";

const baseApi = baseClient<DonationRouteType>().donations;

const keys = {
    baseKey: ["donation-card"],
    donation_card: (streamId: string) =>
        ["donation-card", streamId] as string[],
    donation_card_streamer: (streamerId: string) =>
        ["donation-card-streamer", streamerId] as string[],
    donation_analysis: (period: string) =>
        ["donation-analysis", period] as string[],
};

export const donationApi = {
    query: {
        useGetDonationCard(streamId: string) {
            const $get = baseApi.cards[":streamId"].$get;
            return Fetcher.useHonoQuery($get, keys.donation_card(streamId), {
                param: {
                    streamId,
                },
            });
        },
        useGetDonationCardByStreamer(streamerId: string) {
            const $get = baseApi["cards-streamer"][":streamerId"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.donation_card_streamer(streamerId),
                {
                    param: {
                        streamerId,
                    },
                },
            );
        },
        useGetDonationAnalysis(period: string) {
            const $get = baseApi.analysis.$get;
            return Fetcher.useHonoQuery($get, keys.donation_analysis(period), {
                query: {
                    period,
                },
            });
        },
    },
    mutation: {
        useCreateDonation() {
            const $post = baseApi.donate.$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess(data, { json }) {
                        console.log(data);
                    },
                    onError(err) {
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
        useCreateDonationCard() {
            const $post = baseApi.cards.$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess(data, { json }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.donation_card(json.streamId),
                        });
                        toast.success("Add donation card success.");
                        console.log(data);
                    },
                    onError(err) {
                        toast.error(
                            "Add donation card fail. Please try again!",
                        );
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
        useUpdateDonationCard() {
            const $patch = baseApi.cards[":cardId"].$patch;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $patch,
                {
                    onSuccess(data) {
                        queryClient.invalidateQueries({
                            queryKey: keys.donation_card(
                                data.data.donateCard.streamId,
                            ),
                        });
                        toast.success("Update donation card success.");
                        console.log(data);
                    },
                    onError(err) {
                        toast.error(
                            "Update donation card fail. Please try again!",
                        );
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
        useDeleteDonationCard() {
            const $delete = baseApi.cards[":cardId"].$delete;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $delete,
                {
                    onSuccess(data) {
                        queryClient.invalidateQueries({
                            queryKey: keys.baseKey,
                        });
                        toast.success("Remove donation card success.");
                        console.log(data);
                    },
                    onError(err) {
                        toast.error(
                            "Remove donation card fail. Please try again!",
                        );
                        console.log(err);
                    },
                },
            );
            return mutation;
        },
    },
};
