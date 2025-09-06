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
 *     tags: [Donation]
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
 *           minimum: 1
 *         required: false
 *         description: start date
 *         example: "01/02/2024"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           minimum: 1
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
 */
router.get('/', handleGetUserTransactions);

/**
 * @swagger
 * /api/tx/{txId}:
 *   get:
 *     summary: Get a transaction by Id
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
 *         description: A transaction detail with it's entries
 */

router.get('/:txId', handleGetATransaction);

export default router;
