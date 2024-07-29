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
app.post('/api/lists/col/:id', ListController.addColumn)
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
/**
 * @swagger
 * /api/lists/{id}/columns/{columnId}:
 *   delete:
 *     summary: Delete a column from a list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the column to delete
 *     responses:
 *       200:
 *         description: Column deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: List or column not found
 */
app.delete('/api/lists/:id/columns/:columnId', ListController.deleteColumn);

/**
 * @swagger
 * /api/lists/addrow/{id}:
 *   post:
 *     summary: Add a new row to a list
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
 *               columns:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 example: { "column[id1]": "value1", "column[id2]": "value2" }
 *     responses:
 *       200:
 *         description: Row added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 row:
 *                   $ref: '#/components/schemas/Row'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: List not found
 */
app.post('/api/lists/row/:id', ListController.addRow);


/**
 * @swagger
 * /api/lists/{listId}/deleterow/{rowId}:
 *   delete:
 *     summary: Delete a row from a list
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *       - in: path
 *         name: rowId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the row to delete
 *     responses:
 *       204:
 *         description: Row deleted successfully
 *       404:
 *         description: List or Row not found
 */
app.delete('/api/lists/:listId/row/:rowId', ListController.deleteRow);

app.get('/api/lists/templates', MicrosoftListController.getAllTemplates);


setupSwagger(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
