import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IWalletTransactionRepository } from "../repositories/wallet-transaction.repository";
import { IWalletRepository } from "../repositories/wallet.repository";

import { WalletTransactionDTO } from "../dtos/wallet-transaction.dto";

export interface IWalletService extends Utils.AutoMappedClass<WalletService> {}

export class WalletService implements IWalletService {
    constructor(
        private readonly walletRepository: IWalletRepository,
        private readonly walletTransactionRepository: IWalletTransactionRepository,
    ) {}

    async getWalletByUserId(userId: string) {
        let wallet = await this.walletRepository.findByUserId(userId);

        if (!wallet) {
            wallet = await this.walletRepository.create({ userId });
        }

        return wallet;
    }

    async createWalletIfNotExists(userId: string) {
        try {
            // Try to get existing wallet
            const wallet = await this.walletRepository.findByUserId(userId);
            if (wallet) {
                return wallet;
            }
        } catch (error) {
            // Wallet doesn't exist, create a new one
            console.error("Error while fetching wallet:", error);
        }

        return this.walletRepository.create({ userId });
    }

    async addFunds(
        walletId: string,
        amount: number,
        transactionDetails: WalletTransactionDTO.AddFunds,
    ) {
        const wallet = await this.walletRepository.findById(walletId);
        if (!wallet) {
            throw new MyError.NotFoundError("Wallet not found");
        }

        const transaction = await this.walletTransactionRepository.create({
            ...transactionDetails,
            balanceBefore: wallet.balance,
            balanceAfter: wallet.balance + amount,
            walletId,
            amount,
        });

        // Update wallet balance
        const updatedWallet = await this.walletRepository.updateBalance(
            walletId,
            amount,
        );

        // Update total received if it's a donation
        if (transactionDetails.type === "DONATION_RECEIVED") {
            const totalReceived = (wallet.totalReceived || 0) + amount;
            await this.walletRepository.updateTotalReceived(
                walletId,
                totalReceived,
            );
        }

        return {
            wallet: updatedWallet,
            transaction: transactionDetails,
        };
    }

    async deductFunds(
        walletId: string,
        amount: number,
        transactionDetail: WalletTransactionDTO.DetuctFunds,
    ) {
        const wallet = await this.walletRepository.findById(walletId);
        if (!wallet) {
            throw new MyError.NotFoundError("Wallet not found");
        }

        // Check if wallet has enough balance
        if (wallet.balance < amount) {
            throw new MyError.BadRequestError("Insufficient balance");
        }

        // Create transaction record first
        const transaction = await this.walletTransactionRepository.create({
            ...transactionDetail,
            walletId,
            amount: -amount, // Negative amount for deduction
            balanceBefore: wallet.balance,
            balanceAfter: wallet.balance - amount,
        });

        // Update wallet balance
        const updatedWallet = await this.walletRepository.updateBalance(
            walletId,
            -amount,
        );

        // Update total withdrawn if it's a withdrawal
        if (transactionDetail.type === "WITHDRAWAL") {
            const totalWithdrawn = (wallet.totalWithdrawn || 0) + amount;
            await this.walletRepository.updateTotalWithdrawn(
                wallet.id,
                totalWithdrawn,
            );
        }

        return {
            wallet: updatedWallet,
            transaction,
        };
    }

    async getTransactionHistory(walletId: string, page = 1, size = 10) {
        const wallet = await this.walletRepository.findById(walletId);
        if (!wallet) {
            throw new MyError.NotFoundError("Wallet not found");
        }

        return this.walletTransactionRepository.findByWalletId(
            walletId,
            page,
            size,
        );
    }
}
