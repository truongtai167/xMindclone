import { Request, Response } from 'express';
import { columnClassMapping } from '../model/Column';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';

const microsoftListService = new MicrosoftListService(new MicrosoftList)

const ListController = {
    addColumn: (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, type, value } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Name and type are required' });
        }
        const columnClass = columnClassMapping[type];
        if (!columnClass) {
            return res.status(400).json({ error: 'Invalid column type' });
        }
        const newColumn = new columnClass(name, value);

        const addedColumn = microsoftListService.addColumn(id, newColumn);
        return res.status(200).json({
            success: req ? true : false,
            reponse: addedColumn
        });
    },

    deleteColumn: (req: Request, res: Response) => {
        const { id, columnId } = req.params;
        microsoftListService.deleteColumn(id, columnId);
        return res.status(200).json({
            success: req ? true : false,
        });
    },

    addRow: (req: Request, res: Response) => {
        const { id } = req.params;
        const newRow = microsoftListService.addRow(id, req.body);
        return res.status(200).json({
            success: !!newRow,
            response: newRow
        });
    },
    deleteRow: (req: Request, res: Response) => {
        const { listId, rowId } = req.params;
        microsoftListService.deleteRow(listId, rowId);
        return res.status(200).json({
            success: req ? true : false,
        });
    },
    searchRow: (req: Request, res: Response) => {
        const { listId } = req.params
        const { searchTerm } = req.query as { searchTerm: string };

        if (!listId) {
            res.status(400).json({ error: 'Missing listId' });
            return;
        }

        const results = microsoftListService.searchRow(searchTerm, listId);

        return res.status(200).json({
            success: req ? true : false,
            response: results
        });
    },

    filterRow: (req: Request, res: Response) => {
        const { listId } = req.params
        const { colName, values } = req.query as { colName: string; values: string[] };

        if (!listId) {
            res.status(400).json({ error: 'Missing listId' });
            return;
        }
        const results = microsoftListService.filterRow(listId, colName, values);
        res.status(200).json(results);
        return res.status(200).json({
            success: req ? true : false,
            response: results
        });
    },
    updateRowValue: (req: Request, res: Response) => {
        const { listId } = req.params;
        const { rowId, columnId, value } = req.body;

        if (!listId) {
            return res.status(400).json({ error: 'Missing listId' });
        }

        const updatedRow = microsoftListService.updateRowValue(listId, rowId, columnId, value);
        return res.status(200).json({
            success: true,
            response: updatedRow
        });
    }


};

export { ListController };
