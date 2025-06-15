import { desc, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { walletTransactionTable } from "../../db/schemas/wallet-transaction.table";
import { WalletTransactionDTO } from "../dtos/wallet-transaction.dto";

export interface IWalletTransactionRepository
    extends Utils.AutoMappedClass<WalletTransactionRepository> {}

export class WalletTransactionRepository
    implements IWalletTransactionRepository
{
    private readonly db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async create(data: WalletTransactionDTO.Insert) {
        const [transaction] = await this.db
            .insert(walletTransactionTable)
            .values(data)
            .returning();
        return transaction;
    }

    async findById(id: string) {
        const transaction =
            await this.db.query.walletTransactionTable.findFirst({
                where: eq(walletTransactionTable.id, id),
            });
        return transaction;
    }

    async findByWalletId(walletId: string, page = 1, size = 10) {
        const offset = (page - 1) * size;

        const walletTransactions =
            await this.db.query.walletTransactionTable.findMany({
                where: eq(walletTransactionTable.walletId, walletId),
                limit: size,
                offset,
                with: {
                    wallet: true,
                },
            });

        const walletTransactionCount = await this.db.$count(
            tableSchemas.walletTransactionTable,
            eq(walletTransactionTable.walletId, walletId),
        );

        return {
            data: walletTransactions,
            meta: {
                totalRecords: walletTransactionCount,
                page,
                size,
            },
        };
    }

    async findByOrderId(orderId: string) {
        return this.db
            .select()
            .from(walletTransactionTable)
            .where(eq(walletTransactionTable.orderId, orderId))
            .orderBy(desc(walletTransactionTable.createdAt));
    }

    async findRecentByWalletId(walletId: string, limit = 5) {
        const transactions =
            await this.db.query.walletTransactionTable.findMany({
                where: eq(walletTransactionTable.walletId, walletId),
                limit,
                orderBy: [desc(walletTransactionTable.createdAt)],
            });

        return transactions;
    }
}
