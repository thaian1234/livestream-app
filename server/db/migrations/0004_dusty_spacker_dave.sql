ALTER TABLE "public"."wallet_transactions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transaction_type";--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'DONATION_SENT', 'DONATION_RECEIVED', 'FEE', 'SYSTEM_ADJUSTMENT');--> statement-breakpoint
ALTER TABLE "public"."wallet_transactions" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type" USING "type"::"public"."transaction_type";