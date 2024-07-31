import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';

const microsoftListService = new MicrosoftListService(new MicrosoftList());

const ListController = {
    addColumn: (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, type } = req.body;
            const addedColumn = microsoftListService.addColumn(id, name, type);
            return res.status(200).json({
                success: true,
                response: addedColumn
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    deleteColumn: (req: Request, res: Response) => {
        try {
            const { id, columnId } = req.params;
            microsoftListService.deleteColumn(id, columnId);
            return res.status(200).json({
                success: true
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    addRow: (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const newRow = microsoftListService.addRow(id, req.body);
            return res.status(200).json({
                success: true,
                response: newRow
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    deleteRow: (req: Request, res: Response) => {
        try {
            const { listId, rowId } = req.params;
            microsoftListService.deleteRow(listId, rowId);
            return res.status(200).json({
                success: true
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    searchRow: (req: Request, res: Response) => {
        try {
            const { listId } = req.params;
            const { searchTerm } = req.query as { searchTerm: string };

            const results = microsoftListService.searchRow(searchTerm, listId);

            return res.status(200).json({
                success: true,
                response: results
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    filterRow: (req: Request, res: Response) => {
        try {
            const { listId } = req.params;
            const { colName, values } = req.query as { colName: string; values: string[] };

            const results = microsoftListService.filterRow(listId, colName, values);
            return res.status(200).json({
                success: true,
                response: results
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    updateRowValue: (req: Request, res: Response) => {
        try {
            const { listId, rowId, colId } = req.params;
            const { value } = req.body;

            const updatedRow = microsoftListService.updateRowValue(listId, rowId, colId, value);
            return res.status(200).json({
                success: true,
                response: updatedRow
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    paginateRows: (req: Request, res: Response) => {
        try {
            const { listId } = req.params;
            const { page, limit, search, colName, values } = req.query;
            const pageNumber = parseInt(page as string, 10);
            const pageSize = parseInt(limit as string, 10);
            const valuesArray = typeof values === 'string' ? values.split(',') : (values as string[]);

            const paginatedRows = microsoftListService.paginateRows(
                listId,
                pageNumber,
                pageSize,
                search as string,
                colName as string,
                valuesArray
            );
            return res.status(200).json({
                success: true,
                response: paginatedRows
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    updateColumn: (req: Request, res: Response) => {
        try {
            const { listId, colId } = req.params;
            const { name, type } = req.body;
            const updatedColumn = microsoftListService.updateColumn(listId, colId, name, type);
            return res.status(200).json({
                success: true,
                response: updatedColumn
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};

export { ListController };
