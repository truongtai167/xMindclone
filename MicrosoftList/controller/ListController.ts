import { Request, Response } from 'express';
import { Column, columnClassMapping } from '../model/Column';
import { MicrosoftListService } from '../service/MicrosoftListService';

const microsoftListService = MicrosoftListService.getInstance();

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


};

export { ListController };
