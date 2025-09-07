import express from 'express';
import {
  handleCreateTxPIN,
  handleGetATransaction,
  handleGetUserTransactions,
} from '@/controllers/transaction.controller';
const router = express.Router();

/**
 * @swagger
 * /api/tx/pin:
 *   post:
 *     summary: Creates a transaction PIN
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *                 description: Must be exactly 4 or 6digits long
 *                 minLength: 4
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Tx Pin created successfully
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  data:
 *                    type: string
 *                    example: Pin created successfully
 */

router.post('/pin', handleCreateTxPIN);

/**
 * @swagger
 * /api/tx/:
 *   get:
 *     summary: Get all transactions made by the user
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: false
 *         description: start date
 *         example: "01/02/2024"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: false
 *         description: end date
 *         example: "12/2025"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Number of results per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of transactions made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 4def9fc8-eafd-45f3-9cb2-e551f4e51947
 *                           sourceType:
 *                             type: string
 *                             example: TRANSFER
 *                           reference:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           description:
 *                             type: string
 *                             example: Initial funding
 *                           status:
 *                             type: string
 *                             example: COMPLETED
 *                           amount:
 *                             type: integer
 *                             example: 100000
 *                           currency:
 *                             type: string
 *                             example: NGN
 *                           fee:
 *                             type: integer
 *                             example: 0
 *                           netAmount:
 *                             type: integer
 *                             example: 100000
 *                           metadata:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-09-07T13:56:47.586Z"
 *                           entries:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: fa81e2a9-4e60-42fb-8ee7-760407bfc454
 *                                 type:
 *                                   type: string
 *                                   example: DEBIT
 *                                 transactionId:
 *                                   type: string
 *                                   example: 4def9fc8-eafd-45f3-9cb2-e551f4e51947
 *                                 walletId:
 *                                   type: string
 *                                   example: c617ae73-1fb9-4eff-ae18-7be3272209e8
 *                                 userId:
 *                                   type: string
 *                                   example: system
 *                                 amount:
 *                                   type: integer
 *                                   example: -100000
 *                                 balanceBefore:
 *                                   type: integer
 *                                   example: 1000000000
 *                                 balanceAfter:
 *                                   type: integer
 *                                   example: 999900000
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-09-07T13:56:50.061Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 1
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 */

router.get('/', handleGetUserTransactions);

/**
 * @swagger
 * /api/tx/{txId}:
 *   get:
 *     summary: Get a transaction by Id (with user-specific entry)
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to retrieve
 *         example: 5dad3afe-a870-491d-b640-958daf3459f0
 *     responses:
 *       200:
 *         description: A transaction detail with the calling user’s entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 4def9fc8-eafd-45f3-9cb2-e551f4e51947
 *                     sourceType:
 *                       type: string
 *                       example: TRANSFER
 *                     description:
 *                       type: string
 *                       example: Initial funding
 *                     status:
 *                       type: string
 *                       example: COMPLETED
 *                     amount:
 *                       type: number
 *                       example: 100000
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     fee:
 *                       type: number
 *                       example: 0
 *                     netAmount:
 *                       type: number
 *                       example: 100000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-07T13:56:47.586Z
 *                     entries:
 *                       type: array
 *                       description: Only contains the entry belonging to the calling user
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           type:
 *                             type: string
 *                             example: CREDIT
 *                           transactionId:
 *                             type: string
 *                             format: uuid
 *                           walletId:
 *                             type: string
 *                             format: uuid
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                           amount:
 *                             type: number
 *                             example: 100000
 *                           balanceBefore:
 *                             type: number
 *                             example: 0
 *                           balanceAfter:
 *                             type: number
 *                             example: 100000
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 */


router.get('/:txId', handleGetATransaction);

export default router;
