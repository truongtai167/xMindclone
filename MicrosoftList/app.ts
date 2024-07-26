import express from 'express';
import bodyParser from 'body-parser';
import { MicrosoftListController } from '../MicrosoftList/controller/MircrosoftlistController';
import { ListController } from './controller/ListController';
import setupSwagger from '../swagger'

const app = express();
const port = 3000;

app.use(bodyParser.json());


/**
 * @swagger
 * /api/lists/addcol/{id}:
 *   post:
 *     summary: Add a new column to a list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Column Name
 *               type:
 *                 type: string
 *                 example: Text
 *     responses:
 *       200:
 *         description: Column added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 column:
 *                   $ref: '#/components/schemas/Column'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: List not found
 */
app.post('/api/lists/addcol/:id', ListController.addColumn)
/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a blank list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New List
 *     responses:
 *       201:
 *         description: List created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 list:
 *                   $ref: '#/components/schemas/List'
 *       400:
 *         description: Invalid input
 */
app.post('/api/lists', MicrosoftListController.createBlankList);
/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists
 *     responses:
 *       200:
 *         description: Lists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 */
app.get('/api/lists', MicrosoftListController.getAllLists);
/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to delete
 *     responses:
 *       204:
 *         description: List deleted successfully
 *       404:
 *         description: List not found
 */
app.delete('/api/lists/:id', MicrosoftListController.deleteList);

setupSwagger(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
