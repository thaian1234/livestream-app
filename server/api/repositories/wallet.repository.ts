import { eq } from "drizzle-orm";

import Database from "@/server/db";

import { Utils } from "../lib/helpers/utils";

import { walletTable } from "../../db/schemas/wallet.table";
import { WalletDTO } from "../dtos/wallet.dto";
import { BaseRepository } from "./base.repository";

export interface IWalletRepository
    extends Utils.AutoMappedClass<WalletRepository> {}

export class WalletRepository
    extends BaseRepository
    implements IWalletRepository
{
    async create(data: WalletDTO.Insert) {
        const [wallet] = await this.db
            .insert(walletTable)
            .values(data)
            .returning();
        return wallet;
    }

    async findById(id: string) {
        const [wallet] = await this.db
            .select()
            .from(walletTable)
            .where(eq(walletTable.id, id));
        return wallet;
    }

    async findByUserId(userId: string) {
        const [wallet] = await this.db
            .select()
            .from(walletTable)
            .where(eq(walletTable.userId, userId));
        return wallet;
    }

    async updateBalance(id: string, amount: number) {
        const wallet = await this.findById(id);
        if (!wallet) return null;

        const newBalance = wallet.balance + amount;
        const now = new Date();

        const [updated] = await this.db
            .update(walletTable)
            .set({
                balance: newBalance,
                updatedAt: now.toISOString(),
                lastTransactionAt: now.toISOString(),
            })
            .where(eq(walletTable.id, id))
            .returning();

        return updated;
    }

    async updateLastTransactionTime(id: string) {
        const now = new Date();

        const [updated] = await this.db
            .update(walletTable)
            .set({
                updatedAt: now.toISOString(),
                lastTransactionAt: now.toISOString(),
            })
            .where(eq(walletTable.id, id))
            .returning();

        return updated;
    }

    async updateTotalReceived(id: string, totalReceived: number) {
        const updatedWallet = await this.db
            .update(walletTable)
            .set({
                totalReceived,
            })
            .where(eq(walletTable.id, id))
            .returning();
        return updatedWallet;
    }
    async updateTotalWithdrawn(id: string, totalWithdrawn: number) {
        const updatedWallet = await this.db
            .update(walletTable)
            .set({
                totalWithdrawn,
            })
            .where(eq(walletTable.id, id))
            .returning();
        return updatedWallet;
    }
}
