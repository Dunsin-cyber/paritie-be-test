import express from 'express';
import {handleGetUser} from '@/controllers/user.controller';
import {handleGetUserBalance} from '@/controllers/transaction.controller';
const router = express.Router();



/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Return logged in User
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                       example: 9c3b41d2-daa1-4406-9bac-f67e969fa9d3
 *                     name:
 *                       type: string
 *                       example: Dunsin
 *                     email:
 *                       type: string
 *                       example: dunsin@example.com
 */

router.get('/', handleGetUser);

/**
 * @swagger
 * /api/user/balance:
 *   get:
 *     summary: Return calcualted balance from transactions
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: user balance from transactions
 *         content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                            type: string
 *                            example: success
 *                         data:
 *                           type: number
 *                           example: 100000
 */

router.get('/balance', handleGetUserBalance);

export default router;
