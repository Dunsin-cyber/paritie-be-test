import {PrismaClient, User} from '@prisma/client';
import utils from '@/utils/index';
import {AppError} from '@/utils/AppError';
import {paginate} from '@/utils/pagintion';
import {config} from '@/constants';

const prisma = new PrismaClient();

export const createDonation = async (
  donor: User,
  beneficiaryId: string,
  amount: number,
  txPIN: string
) => {
  if (amount <= 0) {
    throw new AppError('Donation amount must be greater than 0 :(', 400);
  }

  if (!(await utils.decryptPassword(donor.transactionPIN!, txPIN))) {
    throw new AppError(
      'Invalid transaction PIN',
      config.STATUS_CODE.BAD_REQUEST
    );
  }

  const data = await prisma.$transaction(async (tx) => {
    // ? 1 - GET DONAOR AND BENEFICIARY WALLETS

    const donorWallet = await tx.wallet.findUnique({
      where: {userId: donor.id},
      select: {id: true, userId: true, balance: true},
    });

    if (!donorWallet) {
      throw new AppError(
        'Donor wallet not found',
        config.STATUS_CODE.NOT_FOUND
      );
    }

    if (donorWallet.balance < amount) {
      throw new AppError(
        'Insufficient balance to make donation',
        config.STATUS_CODE.BAD_REQUEST
      );
    }

    const beneficiaryWallet = await tx.wallet.findUnique({
      where: {userId: beneficiaryId},
      select: {id: true, userId: true, balance: true},
    });

    if (!beneficiaryWallet) {
      throw new AppError(
        'Beneficiary wallet not found',
        config.STATUS_CODE.NOT_FOUND
      );
    }

    //? 2 - UPDATE WALLET BALANCE
    const updatedDonorWallet = await tx.wallet.update({
      where: {userId: donor.id},
      data: {balance: {decrement: amount}},
    });

    const updatedBeneficiaryWallet = await tx.wallet.update({
      where: {userId: beneficiaryId},
      data: {balance: {increment: amount}},
    });

    //? 3 - CREATE TRANSACTION RECORD, TRANSACTION ENTRY and CREATE DONATION RECORD
    const transaction = await tx.transaction.create({
      data: {
        description: `Donation of N${amount} from ${donor.id} to ${beneficiaryId}`,
        sourceType: 'DONATION',
        status: 'COMPLETED',
        amount,
        currency: 'NGN',
        fee: 0,
        netAmount: amount,
        entries: {
          create: [
            {
              walletId: donorWallet.id,
              type: 'DEBIT',
              userId: donor.id,
              amount: -amount,
              balanceBefore: donorWallet.balance,
              balanceAfter: updatedDonorWallet.balance,
            },
            {
              walletId: beneficiaryWallet.id,
              type: 'CREDIT',
              userId: beneficiaryId,
              amount: amount,
              balanceBefore: beneficiaryWallet.balance,
              balanceAfter: updatedBeneficiaryWallet.balance,
            },
          ],
        },
      },
    });

    const donation = await tx.donation.create({
      data: {
        amount,
        transactionId: transaction.id,
      },
    });

    const {updatedAt, ...cleanDonationReturn} = donation;
    return {
      id: cleanDonationReturn.id,
      amount: cleanDonationReturn.amount,
      transactionId: cleanDonationReturn.transactionId,
      createdAt: cleanDonationReturn.createdAt,
    };
  });

  return data;
};

//TODO:  FIX
export const countUserDonations = async (userId: string) => {
  return prisma.donation.count({
    where: {id: userId},
  });
};

export const donationsInPeriod = async (
  userId: string,
  date?: {start?: Date; end?: Date},
  page?: string,
  limit?: string
) => {
  const where: any = {donorId: userId};

  if (date && date.start && date.start) {
    where.createdAt = {
      gte: date.start,
      lte: date.end,
    };
  }

  return paginate({
    model: 'donation',
    where,
    orderBy: {createdAt: 'desc'},
    page: page ? +page : undefined,
    limit: limit ? +limit : undefined,
  });
};

export const getDonationById = async (donationId: string) => {
  const data = prisma.donation.findUnique({
    where: {id: donationId},
    // include: { beneficiary: true, donor: true }
  });

  return data;
};
