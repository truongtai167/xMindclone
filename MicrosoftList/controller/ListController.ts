import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';

const microsoftListService = new MicrosoftListService(new MicrosoftList());

const ListController = {
    addColumn: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, type, settings } = req.body;
            const addedColumn = await microsoftListService.addColumn(id, name, type, settings);
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

    deleteColumn: async (req: Request, res: Response) => {
        try {
            const { id, columnId } = req.params;
            await microsoftListService.deleteColumn(id, columnId);
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

    addRow: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const newRow = await microsoftListService.addRow(id, req.body);
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

    deleteRow: async (req: Request, res: Response) => {
        try {
            const { listId, rowId } = req.params;
            await microsoftListService.deleteRow(listId, rowId);
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
    updateRowData: async (req: Request, res: Response) => {
        try {
            const { listId, rowId } = req.params;
            const { colId, value } = req.body;

            const updatedRow = await microsoftListService.updateRowData(listId, rowId, colId, value);
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

    getRows: async (req: Request, res: Response) => {
        try {
            const { listId } = req.params;
            const { page, limit, search, colName, values } = req.query;
            const pageNumber = parseInt(page as string, 10);
            const pageSize = parseInt(limit as string, 10);
            const valuesArray = typeof values === 'string' ? values.split(',') : (values as string[]);

            const paginatedRows = await microsoftListService.getRows(
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

    //     updateColumn: (req: Request, res: Response) => {
    //         try {
    //             const { listId, colId } = req.params;
    //             const { name, type } = req.body;
    //             const updatedColumn = microsoftListService.updateColumn(listId, colId, name, type);
    //             return res.status(200).json({
    //                 success: true,
    //                 response: updatedColumn
    //             });
    //         } catch (error: any) {
    //             return res.status(400).json({
    //                 success: false,
    //                 error: error.message
    //             });
    //         }
    //     }
}

export { ListController };
