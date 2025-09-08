import {PrismaClient, User} from '@prisma/client';
import utils from '@/utils/index';
import {AppError} from '@/utils/AppError';
import {paginate} from '@/utils/pagintion';
import {config} from '@/constants';

const prisma = new PrismaClient();

export const createTransfer = async (
  sender: User,
  recepientId: string,
  note: string,
  amount: number,
  txPIN: string
) => {
  if (amount <= 0) {
    throw new AppError('Amount must be greater than 0 :(', config.STATUS_CODE.BAD_REQUEST);
  }

  if (!(await utils.decryptPassword(sender.transactionPIN!, txPIN))) {
    throw new AppError(
      'Invalid transaction PIN',
      config.STATUS_CODE.BAD_REQUEST
    );
  }

  const data = await prisma.$transaction(async (tx) => {
    // ? 1 - GET SENDER AND RECEPIENT WALLETS

    const senderWallet = await tx.wallet.findUnique({
      where: {userId: sender.id},
      select: {id: true, userId: true, balance: true},
    });

    if (!senderWallet) {
      throw new AppError(
        'Please create a wallet first',
        config.STATUS_CODE.NOT_FOUND
      );
    }

    if (senderWallet.balance < amount) {
      throw new AppError(
        'Insufficient balance to make donation',
        config.STATUS_CODE.BAD_REQUEST
      );
    }

    const recepientWallet = await tx.wallet.findUnique({
      where: {userId: recepientId},
      select: {id: true, userId: true, balance: true},
    });

    if (!recepientWallet) {
      throw new AppError(
        'Recepient wallet not found',
        config.STATUS_CODE.NOT_FOUND
      );
    }

    //? 2 - UPDATE WALLET BALANCE
    const updatedsenderWallet = await tx.wallet.update({
      where: {userId: sender.id},
      data: {balance: {decrement: amount}},
    });

    const updatedRecepientWallet = await tx.wallet.update({
      where: {userId: recepientId},
      data: {balance: {increment: amount}},
    });

    //? 3 - CREATE TRANSACTION RECORD, TRANSACTION ENTRY and CREATE DONATION RECORD
    const transaction = await tx.transaction.create({
      data: {
        description: `Transfer of N${amount} from ${sender.id} to ${recepientId}`,
        sourceType: 'TRANSFER',
        status: 'COMPLETED',
        amount,
        currency: 'NGN',
        fee: 0,
        netAmount: amount,
        entries: {
          create: [
            {
              walletId: senderWallet.id,
              type: 'DEBIT',
              userId: sender.id,
              amount: -amount,
              balanceBefore: senderWallet.balance,
              balanceAfter: updatedsenderWallet.balance,
            },
            {
              walletId: recepientWallet.id,
              type: 'CREDIT',
              userId: recepientId,
              amount: amount,
              balanceBefore: recepientWallet.balance,
              balanceAfter: updatedRecepientWallet.balance,
            },
          ],
        },
      },
    });

    const transfer = await tx.transfer.create({
      data: {
        amount,
        transactionId: transaction.id,
        senderId: sender.id,
        recepientId,
        note
      },
    });

    const {updatedAt, ...cleanTransferData} = transfer;
    return {
      id: cleanTransferData.id,
      amount: cleanTransferData.amount,
      note: cleanTransferData.note,
      transactionId: cleanTransferData.transactionId,
      createdAt: cleanTransferData.createdAt,
    };
  });

  return data;
};


export const countUserTransfers = async (userId: string) => {
  return prisma.transfer.count({
    where: {senderId:userId},
  });
};

export const transfersInPeriod = async (
  userId: string,
  date?: {start?: Date; end?: Date},
  page?: string,
  limit?: string
) => {
  const where: any = {senderId: userId};

  if (date && date.start && date.start) {
    where.createdAt = {
      gte: date.start,
      lte: date.end,
    };
  }

  

return paginate({
  model: 'transfer',
  where,
  orderBy: { createdAt: 'desc' },
  page: page ? +page : undefined,
  limit: limit ? +limit : undefined,
  select: {
    id: true,
    amount: true,
    note:true,
    createdAt: true,
    sender: {
      select: {
        id: true,
        name: true,
      }
    },
    recepient: {
      select: {
        id: true,
        name: true,
      }
    },
    transaction: {
      select: {
        id: true,
        sourceType:true,
        status: true,
        createdAt: true,
      }
    }
  }
});
};

export const getTransferById = async (transferId: string) => {
  const data = prisma.transfer.findUnique({
    where: {id: transferId},
     select: {
    id: true,
    amount: true,
    note:true,
    createdAt: true,
    recepient: {
      select: {
        id: true,
        name: true,
      }
    },
    transaction: {
      select: {
        id: true,
        sourceType:true,
        status: true,
        createdAt: true,
      }
    }
  }
});

  return data;
};
