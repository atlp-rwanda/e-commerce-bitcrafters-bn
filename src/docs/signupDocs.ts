/**
 * @swagger
 * components:
 *   schemas:
 *     userModel:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: First name and the Last name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         userRole:
 *           type: string
 *           description: Role of the user
 *           enum:
 *             - admin
 *             - seller
 *             - buyer
 *           default: buyer
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user
 *     tags:
 *       - SIGNUP
 *     requestBody:
 *       description: User object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: A successful response, returns the newly created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *       '400':
 *         description: Invalid email format
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Unexpected error
 */
