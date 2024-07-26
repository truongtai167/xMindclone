import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { List } from '../model/List';

const microsoftListService = new MicrosoftListService();

const MicrosoftListController = {
    createBlankList: (req: Request, res: Response) => {
        const { name } = req.body;
        const list = microsoftListService.createBlankList(name);
        return res.json({
            success: req ? true : false,
            reponse: list
        });
    },

    deleteList: (req: Request, res: Response) => {
        const { id } = req.params;
        microsoftListService.deleteList(id);
        return res.json({
            success: req ? true : false,
        });
    },
    getAllLists: (req: Request, res: Response) => {
        const lists = microsoftListService.getLists();
        res.status(200).json(lists);
        return res.json({
            success: req ? true : false,
            reponse: lists
        });
    },




};
export { MicrosoftListController };
