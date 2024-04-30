/**
 * @swagger
 * /users/changeRole/{userId}:
 *   post:
 *     summary: Changes Role of a user
 *     description: An Admin can be able to change role of someone
 *     tags:
 *       - [USERS]
 *     requestBody:
 *       description: New user ROle to set
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Id of a user to be modified
 *     responses:
 *       '200':
 *         description: A successful response indicating user role changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       '400':
 *         description: Invalid Role set
 *       '404':
 *         description: User Not Found
 *       '500':
 *         description: Unexpected error
 */
