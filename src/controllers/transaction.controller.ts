import {asyncHandler} from '@/middlewares/asyncHandler';
import {
  setTransactionPIN,
  getUserTransactions,
  getBalanceFromTxs,
  getATransaction,
} from '@/services/transaction.service';
import utils from '@/utils';
import {ApiResponse} from '@/utils/ApiResponse';
import {AppError} from '@/utils/AppError';
import {User} from '@prisma/client';
import {NextFunction, Request, Response} from 'express';
import {validate as uuidValidate} from 'uuid';
import {config} from '@/constants';

export const handleCreateTxPIN = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validInput = utils.validPIN(req.body.pin);
    if (!validInput) {
      throw new AppError('Invalid pin format', config.STATUS_CODE.BAD_REQUEST);
    }

    const user = (req as Request & {user?: User}).user!;
    await setTransactionPIN(user.id, req.body.pin);

    return res
      .status(config.STATUS_CODE.CREATED)
      .json(new ApiResponse('success', 'Pin created successfully'));
  }
);

export const handleGetUserTransactions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & {user?: User}).user!;

    const {from, to, limit, page} = req.query;
    let startDate;
    let endDate;

    if (from) {
      startDate = utils.dataParser(from as string);
    }
    if (to) {
      endDate = utils.dataParser(to as string);
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      throw new AppError('There must be both start and end date', config.STATUS_CODE.BAD_REQUEST);
    }

    const date = {start: startDate?.start, end: endDate?.end};

    const txs = await getUserTransactions(
      user.id,
      date,
      page as string,
      limit as string
    );

    return res.status(config.STATUS_CODE.OK).json(new ApiResponse('success', txs));
  }
);

//TODO: support finding by both userid and wallet id togther for security, after 
//global user type issue has been fixed 
export const handleGetUserBalance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & {user?: User}).user!;
    
    const txs = await getBalanceFromTxs(user.id);

    return res.status(config.STATUS_CODE.OK).json(new ApiResponse('success', txs));
  }
);

export const handleGetATransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const txId = req.params.txId;
    const user = (req as Request & {user?: User}).user!;


    const validTxId = uuidValidate(txId);
    if (!validTxId) {
      throw new AppError('Invalid transaction ID format', config.STATUS_CODE.BAD_REQUEST);
    }

    const tx = await getATransaction(txId, user.id);

    if (!tx) {
      throw new AppError('Transaction Entry not found', config.STATUS_CODE.NOT_FOUND);
    }

    return res.status(config.STATUS_CODE.OK).json(new ApiResponse('success', tx));
  }
);
