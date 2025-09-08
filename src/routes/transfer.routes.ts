import express from 'express';
import { handleCreateTransfer, handleFilterTransfers, handleTransferDetails } from '@/controllers/transfer.controller';

const router = express.Router();

/**
 * @swagger
 * /api/transfer/create:
 *   post:
 *     summary: Create a transfer transaction
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - recepeintEmail
 *               - note
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to donate
 *                 example: 50.0
 *               recepientEmail:
 *                 type: string
 *                 description: Email of the beneficiary receiving the donation
 *                 example: "toyo@example.com"
 *               note:
 *                 type: string
 *                 description: extra note for the transfer
 *                 example: "transfer for school fees"
 *               transactionPin:
 *                 type: string
 *                 description: User's 4 or 6 digit transaction PIN
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Transfer created successfully
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
 *                       example: d9b7687a-c116-48d9-a02c-fe45fe725940
 *                     amount:
 *                       type: number
 *                       example: 50
 *                     note:
 *                       type: string
 *                       example: tansfer for school fee
 *                     transactionId:
 *                       type: string
 *                       format: uuid
 *                       example: b46f3a63-e86a-4efe-bd61-370af75cfbea
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-07T18:10:21.666Z
 *       400:
 *         description: Invalid request payload or parameters
 *       401:
 *         description: Unauthorized — invalid transaction PIN
 *       500:
 *         description: Internal server error
 */
router.post('/create', handleCreateTransfer);

/**
 * @swagger
 * /api/transfer/my-transfers:
 *   get:
 *     summary: Get transfers made by the authenticated user within a date range
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering transfers
 *         example: "2024-02-01"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering transfers
 *         example: "2025-12-31"
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
 *         description: List of transfers retrieved successfully
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
 *                             example: f5e546d6-eacc-4335-b189-e7c4386fd59d
 *                           amount:
 *                             type: number
 *                             example: 1000
 *                           note:
 *                             type: string
 *                             example: transfer for school fees
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-08T14:22:22.209Z
 *                           sender:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: 227693eb-5c30-4db8-b053-2b3c28c7f8e1
 *                               name:
 *                                 type: string
 *                                 example: Toyo
 *                           recepient:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: b52d3fd8-0543-417e-b1fc-fd63e67c1c8d
 *                               name:
 *                                 type: string
 *                                 example: Dunsin
 *                           transaction:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: 32a74818-aaad-42d9-97d8-a350d04b22c6
 *                               sourceType:
 *                                 type: string
 *                                 example: TRANSFER
 *                               status:
 *                                 type: string
 *                                 example: COMPLETED
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2025-09-08T14:22:20.561Z
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
 *       404:
 *         description: No transfers found
 */

router.get('/my-transfers', handleFilterTransfers);

/**
 * @swagger
 * /api/transfer/{id}:
 *   get:
 *     summary: Get details of a specific transfer by ID
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transfer to retrieve
 *     responses:
 *       200:
 *         description: Transfer details retrieved successfully
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
 *                       example: f5e546d6-eacc-4335-b189-e7c4386fd59d
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     note:
 *                       type: string
 *                       example: transfer for school fees
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-08T14:22:22.209Z
 *                     recepient:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: b52d3fd8-0543-417e-b1fc-fd63e67c1c8d
 *                         name:
 *                           type: string
 *                           example: Dunsin
 *                     transaction:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 32a74818-aaad-42d9-97d8-a350d04b22c6
 *                         sourceType:
 *                           type: string
 *                           example: TRANSFER
 *                         status:
 *                           type: string
 *                           example: COMPLETED
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-09-08T14:22:20.561Z
 *       404:
 *         description: Transfer not found
 */

router.get('/:id', handleTransferDetails);

export default router;
