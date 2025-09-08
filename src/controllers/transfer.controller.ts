import {asyncHandler} from '@/middlewares/asyncHandler';
import {ApiResponse} from '@/utils/ApiResponse';
import {AppError} from '@/utils/AppError';
import {NextFunction, Request, Response} from 'express';
import {
  createTransfer,
  transfersInPeriod,
  getTransferById,
} from '@/services/transfer.service';
import {getUserPrivateFn} from '@/services/auth.service';
import {validate as uuidValidate} from 'uuid';
import utils from '@/utils/index';
import {User} from '@prisma/client';
import { config } from '@/constants';


export const handleCreateTransfer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: check if both params are wrong too
    const {amount,note, recepientEmail, transactionPin} = req.body;
    if (typeof amount != 'number' || !utils.validEmail(recepientEmail) || !note) {
      throw new AppError('Invalid input data', config.STATUS_CODE.BAD_REQUEST);
    }

    const user = (req as Request & {user?: User}).user!;
    if (!user.transactionPIN) {
      throw new AppError('Please set a Transaction PIN first', config.STATUS_CODE.BAD_REQUEST

      );
    }
    if (!transactionPin || !utils.validPIN(transactionPin)) {
      throw new AppError('Invalid transaction PIN', config.STATUS_CODE.BAD_REQUEST);
    }

    const recepient = await getUserPrivateFn(
      utils.formatEmail(recepientEmail)
    );

    if (!recepient) {
      throw new AppError('Recepient does not exist',config.STATUS_CODE.NOT_FOUND );
    }

    if (utils.formatEmail(recepientEmail) === user.email) {
      throw new AppError('You cannot Transfer to Self', config.STATUS_CODE.BAD_REQUEST);
    }

    const donation = await createTransfer(
      user,
      recepient.id,
      note,
      amount,
      transactionPin
    );

    return res.status(config.STATUS_CODE.CREATED).json(new ApiResponse('success', donation));
  }
);

//! DEPRECATED TO FAVOUR handleFilterDonations
export const handleGetUserTransfers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const handleFilterTransfers = asyncHandler(
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

    const donations = await transfersInPeriod(
      user.id,
      date,
      page as string,
      limit as string
    );

    if (!donations) {
      throw new AppError('No donations found in this period', config.STATUS_CODE.NOT_FOUND);
    }

    return res.status(config.STATUS_CODE.OK).json(new ApiResponse('success', donations));
  }
);

export const handleTransferDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transferId = req.params.id;
    if (!transferId) {
      throw new AppError('Donation ID is required', config.STATUS_CODE.BAD_REQUEST);
    }
    const validUUID = uuidValidate(transferId);
    if (!validUUID) {
      throw new AppError('Invalid donation ID format', config.STATUS_CODE.BAD_REQUEST);
    }
    const donation = await getTransferById(transferId);

    if (!donation) {
      throw new AppError('Donation not found', config.STATUS_CODE.NOT_FOUND);
    }

    return res.status(config.STATUS_CODE.OK).json(new ApiResponse('success', donation));
  }
);
