import { Request, Response } from 'express';
import { ListService } from '../service/ListService';
import { Column, columnClassMapping } from '../model/Column';
import { MicrosoftListService } from '../service/MicrosoftListService';

const microsoftListService = new MicrosoftListService()

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
        res.status(201).json(addedColumn);
    },
};

export { ListController };
