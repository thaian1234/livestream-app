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
        const wallet = await this.walletRepository.findByUserId(userId);

        if (!wallet) {
            throw new MyError.NotFoundError("Wallet not found for this user");
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
        transactionDetails: WalletTransactionDTO.Insert,
    ) {
        if (amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }

        const wallet = await this.walletRepository.findById(walletId);
        if (!wallet) {
            throw new MyError.NotFoundError("Wallet not found");
        }

        // Create transaction record first
        const transaction = await this.walletTransactionRepository.create({
            walletId,
            amount,
            type: transactionDetails.type,
            description: transactionDetails.description,
            balanceBefore: wallet.balance,
            balanceAfter: wallet.balance + amount,
            orderId: transactionDetails.orderId,
            referenceId: transactionDetails.referenceId,
            metadata: transactionDetails.metadata,
        });

        // Update wallet balance
        const updatedWallet = await this.walletRepository.updateBalance(
            walletId,
            amount,
        );

        // Update total received if it's a donation
        if (transactionDetails.type === "DONATION_RECEIVED") {
            const totalReceived = wallet.totalReceived || 0 + amount;
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
        transactionDetail: WalletTransactionDTO.Insert,
    ) {
        if (amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }

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
            walletId,
            amount: -amount, // Negative amount for deduction
            type: transactionDetail.type,
            description: transactionDetail.description,
            balanceBefore: wallet.balance,
            balanceAfter: wallet.balance - amount,
            orderId: transactionDetail.orderId,
            referenceId: transactionDetail.referenceId,
            metadata: transactionDetail.metadata,
        });

        // Update wallet balance
        const updatedWallet = await this.walletRepository.updateBalance(
            walletId,
            -amount,
        );

        // Update total withdrawn if it's a withdrawal
        if (transactionDetail.type === "WITHDRAWAL") {
            const totalWithdrawn = wallet.totalWithdrawn || 0 + amount;
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
