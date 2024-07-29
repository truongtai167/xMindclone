import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';


const microsoftListService = new MicrosoftListService(new MicrosoftList)

const MicrosoftListController = {
    createBlankList: (req: Request, res: Response) => {
        const { name } = req.body;
        const list = microsoftListService.createBlankList(name);
        return res.status(200).json({
            success: req ? true : false,
            reponse: list
        });
    },
    createListFromTemplate: (req: Request, res: Response) => {
        const { templateId, name } = req.body
        const list = microsoftListService.createListFromTemplate(templateId, name)
        return res.status(200).json({
            success: req ? true : false,
            reponse: list
        });
    },

    deleteList: (req: Request, res: Response) => {
        const { id } = req.params;
        microsoftListService.deleteList(id);
        return res.status(200).json({
            success: req ? true : false,
        });
    },
    getAllLists: (req: Request, res: Response) => {
        const lists = microsoftListService.getLists();
        return res.status(200).json({
            success: req ? true : false,
            reponse: lists
        });
    },
    getListById: (req: Request, res: Response) => {
        const { listId } = req.params
        const list = microsoftListService.getListById(listId)
        return res.status(200).json({
            success: req ? true : false,
            reponse: list
        });
    },
    getAllTemplates: (req: Request, res: Response) => {
        const templates = microsoftListService.getTemplates();
        return res.status(200).json({
            success: req ? true : false,
            reponse: templates
        });
    },

};
export { MicrosoftListController };
