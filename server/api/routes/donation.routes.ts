import { CreateFactoryType } from "../lib/types/factory.type";

import { IDonationController } from "../controllers/donation.controller";

export class DonationRoutes {
    constructor(
        private factory: CreateFactoryType,
        private donationController: IDonationController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/donations", this.donationController.setupHandlers());
    }
}

export type DonationRouteType = ReturnType<
    typeof DonationRoutes.prototype.setupRoutes
>;
