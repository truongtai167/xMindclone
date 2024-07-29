import express from 'express';
import bodyParser from 'body-parser';
import { MicrosoftListController } from '../MicrosoftList/controller/MircrosoftlistController';
import { ListController } from './controller/ListController';
import setupSwagger from '../swagger';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/lists/col/:id', ListController.addColumn);
app.delete('/api/lists/:id/columns/:columnId', ListController.deleteColumn);
app.post('/api/lists/row/:id', ListController.addRow);
app.delete('/api/lists/:listId/row/:rowId', ListController.deleteRow);
app.get('/api/lists/:listId/search', ListController.searchRow);
app.get('/api/lists/:listId/filter', ListController.filterRow);
app.put('/api/lists/:listId', ListController.updateRowValue);


app.post('/api/lists', MicrosoftListController.createBlankList);
app.get('/api/lists', MicrosoftListController.getAllLists);
app.delete('/api/lists/:id', MicrosoftListController.deleteList);
app.get('/api/lists/templates', MicrosoftListController.getAllTemplates);
app.post('/api/lists/templates', MicrosoftListController.createListFromTemplate);
app.get('/api/lists/:listId', MicrosoftListController.getListById);




setupSwagger(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

/**
 * @swagger
 * /api/lists/col/{id}:
 *   post:
 *     summary: Add a new column to a list
 *     tags : [List]
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

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a blank list
 *     tags : [List management]
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

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists
 *     tags : [List management]
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

/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     tags : [List management]
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

/**
 * @swagger
 * /api/lists/{id}/columns/{columnId}:
 *   delete:
 *     summary: Delete a column from a list
 *     tags : [List]
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

/**
 * @swagger
 * /api/lists/row/{id}:
 *   post:
 *     summary: Add a new row to a list
 *     tags : [List]
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

/**
 * @swagger
 * /api/lists/{listId}/row/{rowId}:
 *   delete:
 *     summary: Delete a row from a list
 *     tags : [List] 
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

/**
 * @swagger
 * /api/lists/templates:
 *   get:
 *     summary: Get all templates
 *     tags : [List management]
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 */

/**
 * @swagger
 * /api/lists/{listId}/search:
 *   get:
 *     summary: Search rows in a list
 *     tags : [List]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: The term to search for
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to search in
 *     responses:
 *       200:
 *         description: Rows matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Row'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: List not found
 */

/**
 * @swagger
 * /api/lists/{listId}/filter:
 *   get:
 *     summary: Filter rows in a list
 *     tags : [List]
 *     parameters:
 *       - in: query
 *         name: colName
 *         required: true
 *         schema:
 *           type: string
 *         description: The column name to filter by
 *       - in: query
 *         name: values
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The values to filter by
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to filter in
 *     responses:
 *       200:
 *         description: Rows matching the filter criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Row'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: List not found
 */
/**
 * @swagger
 * /api/lists/templates:
 *   post:
 *     summary: Create a list from a template
 *     tags : [List management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *                 example: template-123
 *                 description: The ID of the template to use for creating the new list
 *               name:
 *                 type: string
 *                 example: New List from Template
 *                 description: The name of the new list
 *     responses:
 *       200:
 *         description: List created successfully from the template
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   $ref: '#/components/schemas/List'
 *       400:
 *         description: Invalid input or template not found
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/lists/{listId}:
 *   put:
 *     summary: Update the value of a column in a row
 *     tags : [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list containing the row
 *       - in: query
 *         name: rowId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the row to update
 *       - in: query
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the column to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: Updated Value
 *     responses:
 *       200:
 *         description: Row value updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   $ref: '#/components/schemas/Row'
 *       400:
 *         description: Invalid input or missing parameters
 *       404:
 *         description: List, row, or column not found
 */
/**
 * @swagger
 * /api/lists/{listId}:
 *   get:
 *     summary: Get a list by its ID
 *     tags : [List management]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   $ref: '#/components/schemas/List'
 *       400:
 *         description: Bad request, list ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: List ID is required
 *       404:
 *         description: List not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: List not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error message here
 */
