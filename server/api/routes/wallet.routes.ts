import { CreateFactoryType } from "../lib/types/factory.type";

import { IWalletController } from "../controllers/wallet.controller";

export class WalletRoutes {
    constructor(
        private factory: CreateFactoryType,
        private walletController: IWalletController,
    ) {}
    public setupRoutes() {
        return this.factory
            .createApp()
            .route("/wallets", this.walletController.setupHandlers());
    }
}

export type WalletRouteType = ReturnType<
    typeof WalletRoutes.prototype.setupRoutes
>;
