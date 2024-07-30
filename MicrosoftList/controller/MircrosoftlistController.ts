import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';


const microsoftListService = new MicrosoftListService(new MicrosoftList)

const MicrosoftListController = {
    createBlankList: (req: Request, res: Response) => {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }
        const list = microsoftListService.createBlankList(name);
        return res.status(200).json({
            success: true,
            reponse: list
        });
    },
    createListFromTemplate: (req: Request, res: Response) => {
        const { templateId, name } = req.body
        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }
        const list = microsoftListService.createListFromTemplate(templateId, name)
        return res.status(200).json({
            success: true,
            reponse: list
        });
    },

    deleteList: (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Missing listId' });
        }
        microsoftListService.deleteList(id);
        return res.status(200).json({
            success: true
        });
    },
    getAllLists: (req: Request, res: Response) => {
        const lists = microsoftListService.getLists();
        return res.status(200).json({
            success: true,
            reponse: lists
        });
    },
    getListById: (req: Request, res: Response) => {
        const { listId } = req.params
        if (!listId) {
            return res.status(400).json({ error: 'Missing listId' });
        }
        const list = microsoftListService.getListById(listId)
        return res.status(200).json({
            success: true,
            reponse: list
        });
    },
    getAllTemplates: (req: Request, res: Response) => {
        const templates = microsoftListService.getTemplates();
        return res.status(200).json({
            success: true,
            reponse: templates
        });
    },

};
export { MicrosoftListController };
