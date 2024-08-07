import request from 'supertest';
import express from 'express';
import { MicrosoftListController } from './controller/MircrosoftlistController';
import { ListController } from './controller/ListController';
import { MicrosoftListService } from './service/MicrosoftListService';

// Setup Express app for testing
const app = express();
app.use(express.json());

// Setup routes
app.post('/api/lists', MicrosoftListController.createBlankList);
app.get('/api/lists', MicrosoftListController.getAllLists);
app.delete('/api/lists/:id', MicrosoftListController.deleteList);
app.get('/api/lists/templates', MicrosoftListController.getAllTemplates);
app.post('/api/lists/templates', MicrosoftListController.createListFromTemplate);
app.get('/api/lists/:listId', MicrosoftListController.getListById);


app.post('/api/lists/:id/col', ListController.addColumn);
app.delete('/api/lists/:id/columns/:columnId', ListController.deleteColumn);
app.post('/api/lists/:id/row', ListController.addRow);
app.delete('/api/lists/:listId/row/:rowId', ListController.deleteRow);
app.put('/api/lists/:listId/row/:rowId/col', ListController.updateRowData);
app.get('/api/lists/:listId/rows', ListController.getRows);
app.put('/api/lists/:listId/col/:colId', ListController.updateColumn);

// Mock MicrosoftListService
jest.mock('./service/MicrosoftListService');


describe('Microsoft List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a blank list', async () => {
        const mockList = { id: '1', name: 'Test List' };
        (MicrosoftListService.prototype.createBlankList as jest.Mock).mockResolvedValue(mockList);

        const response = await request(app).post('/api/lists').send({ name: 'Test List' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockList,
        });
    });

    it('should delete a list', async () => {
        (MicrosoftListService.prototype.deleteList as jest.Mock).mockResolvedValue(undefined);

        const response = await request(app).delete('/api/lists/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('should get all lists', async () => {
        const mockLists = [{
            id: '1',
            name: 'Test List 1',
            columns: [
                {
                    id: "1",
                    name: "Choice Column",
                    type: "Choice",
                    settings: [
                        {
                            "name": "choices",
                            "value": "Choice 1,Choice 2,Choice 3"
                        }
                    ]
                },
                {
                    id: "2",
                    name: "Profile Link",
                    type: "Hyperlink",
                    settings: [
                        {
                            "name": "maxlength",
                            "value": "255"
                        }
                    ]
                },
                {
                    id: "3",
                    name: "Full Name",
                    type: "Text",
                    settings: [
                        {
                            "name": "maxlength",
                            "value": "255"
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            name: 'Test List 2',
            columns: []
        }
        ];
        (MicrosoftListService.prototype.getLists as jest.Mock).mockResolvedValue(mockLists);

        const response = await request(app).get('/api/lists');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockLists,
        });
    });


    it('should get a list by id', async () => {
        const mockList = {
            id: '1',
            name: 'Test List 1',
            columns: [
                {
                    id: "1",
                    name: "Choice Column",
                    type: "Choice",
                    settings: [
                        {
                            "name": "choices",
                            "value": "Choice 1,Choice 2,Choice 3"
                        }
                    ]
                },
                {
                    id: "2",
                    name: "Profile Link",
                    type: "Hyperlink",
                    settings: [
                        {
                            "name": "maxlength",
                            "value": "255"
                        }
                    ]
                },
                {
                    id: "3",
                    name: "Full Name",
                    type: "Text",
                    settings: [
                        {
                            "name": "maxlength",
                            "value": "255"
                        }
                    ]
                }
            ]
        };
        (MicrosoftListService.prototype.getListById as jest.Mock).mockResolvedValue(mockList);

        const response = await request(app).get('/api/lists/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockList,
        });
    });
    it('should add a column', async () => {
        const mockColumn = { id: '1', name: 'Test Column', type: 'Text' };
        (MicrosoftListService.prototype.addColumn as jest.Mock).mockResolvedValue(mockColumn);

        const response = await request(app).post('/api/lists/1/col').send({ name: 'Test Column', type: 'Text' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockColumn,
        });
    });

    it('should delete a column', async () => {
        (MicrosoftListService.prototype.deleteColumn as jest.Mock).mockResolvedValue(undefined);

        const response = await request(app).delete('/api/lists/1/columns/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('should add a row', async () => {
        const mockRow = { id: '1', values: { '1': 'value1' } };
        (MicrosoftListService.prototype.addRow as jest.Mock).mockResolvedValue(mockRow);

        const response = await request(app).post('/api/lists/1/row').send({ values: { '1': 'value1' } });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockRow,
        });
    });

    it('should delete a row', async () => {
        (MicrosoftListService.prototype.deleteRow as jest.Mock).mockResolvedValue(undefined);

        const response = await request(app).delete('/api/lists/1/row/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('should update row data', async () => {
        const updatedRow = { colId: '1', values: 'Update Value' };
        (MicrosoftListService.prototype.updateRowData as jest.Mock).mockResolvedValue(updatedRow);

        const response = await request(app).put('/api/lists/1/row/1/col').send({ colId: '1', values: 'Update Value' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: updatedRow,
        });
    });

    it('should get rows by list id with pagination', async () => {
        const mockRows = [
            {
                id: "1",
                values: [
                    {
                        columnName: "Profile Link",
                        url: "https://www.youtube.com/",
                        displayText: " Tai Dang"
                    },
                    {
                        columnName: "Full Name",
                        value: "Tai Dang"
                    },
                    {
                        columnName: "Name 15",
                        choices: [
                            "Choice 1"
                        ]
                    }
                ]
            },
            {
                id: "2",
                values: [
                    {
                        columnName: "Profile Link",
                        url: "https://www.youtube.com/",
                        displayText: " Khoi Nguyen"
                    },
                    {
                        columnName: "Full Name",
                        value: "Khoi Nguyen"
                    },
                    {
                        columnName: "Name 15",
                        choices: [
                            "Choice 1"
                        ]
                    }
                ]
            }
        ];
        (MicrosoftListService.prototype.getRows as jest.Mock).mockResolvedValue(mockRows);

        const response = await request(app).get('/api/lists/1/rows?page=1&limit=2');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockRows,
        });
    });

    it('should get rows by list id with search', async () => {
        const mockRows = [
            {
                id: "1",
                values: [
                    {
                        columnName: "Profile Link",
                        url: "https://www.youtube.com/",
                        displayText: " Tai Dang"
                    },
                    {
                        columnName: "Full Name",
                        value: "Tai Dang"
                    },
                    {
                        columnName: "Name 15",
                        choices: [
                            "Choice 1"
                        ]
                    }
                ]
            },
        ];
        (MicrosoftListService.prototype.getRows as jest.Mock).mockResolvedValue(mockRows);


        const response = await request(app).get('/api/lists/1/rows?page=1&limit=10&search=Tai Dang');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockRows,
        });
    });
    it('should get rows by list id with filter', async () => {
        const mockRows = [
            {
                id: "1",
                values: [
                    {
                        columnName: "Profile Link",
                        url: "https://www.youtube.com/",
                        displayText: " Tai Dang"
                    },
                    {
                        columnName: "Full Name",
                        value: "Tai Dang"
                    },
                    {
                        columnName: "Name 15",
                        choices: [
                            "Choice 1"
                        ]
                    }
                ]
            },
        ];
        (MicrosoftListService.prototype.getRows as jest.Mock).mockResolvedValue(mockRows);


        const response = await request(app).get('/api/lists/1/rows?page=1&limit=10&colName=Full Name 6&values=Tai Dang');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockRows,
        });
    });

    it('should get all template', async () => {
        const mockTemplate = [
            {
                id: '1',
                name: 'Test List 1',
                columns: [
                    {
                        id: "1",
                        name: "Choice Column",
                        type: "Choice",
                        settings: [
                            {
                                "name": "choices",
                                "value": "Choice 1,Choice 2,Choice 3"
                            }
                        ]
                    },
                    {
                        id: "2",
                        name: "Profile Link",
                        type: "Hyperlink",
                        settings: [
                            {
                                "name": "maxlength",
                                "value": "255"
                            }
                        ]
                    },
                    {
                        id: "3",
                        name: "Full Name",
                        type: "Text",
                        settings: [
                            {
                                "name": "maxlength",
                                "value": "255"
                            }
                        ]
                    }
                ]
            },
        ];
        (MicrosoftListService.prototype.getTemplates as jest.Mock).mockResolvedValue(mockTemplate);

        const response = await request(app).get('/api/lists/templates');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: mockTemplate,
        });
    });
    it('should update a column', async () => {
        // Mock the updated column data
        const updatedColumn = {
            id: '1',
            name: 'Updated Column',
            type: 'Text',
            settings: [
                {
                    name: 'maxlength',
                    value: '500'
                }
            ]
        };

        // Mock the `updateColumn` method in MicrosoftListService
        (MicrosoftListService.prototype.updateColumn as jest.Mock).mockResolvedValue(updatedColumn);

        // Send a PUT request to update the column
        const response = await request(app)
            .put('/api/lists/1/col/1')
            .send({
                name: 'Updated Column',
                type: 'Text',
            });

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            response: updatedColumn,
        });
    });


});
