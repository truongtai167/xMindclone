import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { List } from '../model/List';

const microsoftListService = new MicrosoftListService();

const MicrosoftListController = {
    createBlankList: (req: Request, res: Response) => {
        const { name } = req.body;
        const list = microsoftListService.createBlankList(name);
        res.status(201).json(list);
    },

    deleteList: (req: Request, res: Response) => {
        const { id } = req.params;
        microsoftListService.deleteList(id);
        res.status(204).end();
    },

    importList: (req: Request, res: Response) => {
        const { list } = req.body;
        if (!list) {
            return res.status(400).json({ error: 'List data is required' });
        }
        const importedList = new List(list.name);
        microsoftListService.importList(importedList);
        res.status(201).json(importedList);
    },

    addFavoriteList: (req: Request, res: Response) => {
        const { id } = req.params;
        microsoftListService.addFavoriteList(id);
        res.status(200).json({ message: 'List added to favorites' });
    },

    removeFavoriteList: (req: Request, res: Response) => {
        const { id } = req.params;
        microsoftListService.removeFavoriteList(id);
        res.status(200).json({ message: 'List removed from favorites' });
    },

    addTemplateList: (req: Request, res: Response) => {
        const { templateId, name } = req.body;
        if (!templateId || !name) {
            return res.status(400).json({ error: 'Template ID and name are required' });
        }
        microsoftListService.addTemplateList(templateId, name);
        res.status(201).json({ message: 'List created from template' });
    },

    createListExisting: (req: Request, res: Response) => {
        const { listId, name } = req.body;
        if (!listId || !name) {
            return res.status(400).json({ error: 'List ID and name are required' });
        }
        microsoftListService.createListExisting(listId, name);
        res.status(201).json({ message: 'List created from existing list' });
    },

    // saveFile: (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const { filename } = req.body;
    //     if (!filename) {
    //         return res.status(400).json({ error: 'Filename is required' });
    //     }
    //     microsoftListService.saveFile(id, filename);
    //     res.status(200).json({ message: 'List saved to file' });
    // },

    // loadFile: (req: Request, res: Response) => {
    //     const { filename } = req.body;
    //     if (!filename) {
    //         return res.status(400).json({ error: 'Filename is required' });
    //     }
    //     const list = microsoftListService.loadFile(filename);
    //     res.status(200).json(list);
    // },

    // saveAll: (req: Request, res: Response) => {
    //     const { filename } = req.body;
    //     if (!filename) {
    //         return res.status(400).json({ error: 'Filename is required' });
    //     }
    //     microsoftListService.saveAll(filename);
    //     res.status(200).json({ message: 'All lists saved to file' });
    // }
};

export { MicrosoftListController };
