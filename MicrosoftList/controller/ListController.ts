import { Request, Response } from 'express';
import { List } from '../model/List';
import { ColumnType } from '../model/Column';
import { MicrosoftList } from '../model/MicrosoftList';

const microsoftList = new MicrosoftList();

export const createList = (req: Request, res: Response) => {
    const { name } = req.body;
    const list = new List(name);
    microsoftList.lists.push(list);
    res.json(list);
};

export const getList = (req: Request, res: Response) => {
    const { listId } = req.params;
    const list = microsoftList.lists.find(list => list.id === listId);
    if (list) {
        res.json(list);
    } else {
        res.status(404).send('List not found');
    }
};

export const addColumn = (req: Request, res: Response) => {
    const { listId } = req.params;
    const { name, type } = req.body;
    const list = microsoftList.lists.find(list => list.id === listId);
    if (list) {
        const column = createColumn(name, type as ColumnType);
        list.columns.push(column);
        res.json(column);
    } else {
        res.status(404).send('List not found');
    }
};
