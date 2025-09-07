import express from 'express';
import {
  handleCreateAcc,
  handleLoginAcc,
  handleRefreshToken,
  handleLogout,
} from '@/controllers/auth.controller';
const router = express.Router();

/**
 * @swagger
 * /api/auth/create:
 *   post:
 *     summary: Creates a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Must be at least 2 characters long, only letters and spaces allowed
 *                 minLength: 2
 *                 pattern: '^[A-Za-z ]+$'
 *                 example: Dunsin
 *               email:
 *                 type: string
 *                 description: Must be a valid email address
 *                 format: email
 *                 example: dunsin@example.com
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT token for authentication
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

router.post('/create', handleCreateAcc);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Must be a valid email address
 *                 format: email
 *                 example: dunsin@example.com
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
 *                 example: StrongPass123
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT token for authentication
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

router.post('/login', handleLoginAcc);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNzEwYzI0NC1kMzRmLTQ4OGEtYWIyYS03NDUzMDIxYzIyODgiLCJpYXQiOjE3NTYxMTUxMDQsImV4cCI6MTc1NjcxOTkwNH0.eedeTOuvLma-vAwKtVp4Wco1t0MFV8lCmQXExduXp8g
 *         description: HTTP-only refresh token cookie
 *     responses:
 *       200:
 *         description: New access token returned valid for 7 days
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT token for authentication
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token missing or invalid
 */
router.post('/refresh-token', handleRefreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout (clears refresh token cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out and refresh token cookie cleared
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
 *                    example: Logged out
 */
router.get('/logout', handleLogout);

export default router;
