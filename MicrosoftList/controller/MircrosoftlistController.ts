import { Request, Response } from 'express';
import { MicrosoftListService } from '../service/MicrosoftListService';
import { MicrosoftList } from '../model/MicrosoftList';

const microsoftListService = new MicrosoftListService(new MicrosoftList());

const MicrosoftListController = {
    createBlankList: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const list = await microsoftListService.createBlankList(name);
            return res.status(200).json({
                success: true,
                response: list
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },


    deleteList: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await microsoftListService.deleteList(id);
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

    getAllLists: async (req: Request, res: Response) => {
        try {
            const lists = await microsoftListService.getLists();
            return res.status(200).json({
                success: true,
                response: lists
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    getListById: async (req: Request, res: Response) => {
        try {
            const { listId } = req.params;
            const list = await microsoftListService.getListById(listId);
            return res.status(200).json({
                success: true,
                response: list
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    getAllTemplates: (req: Request, res: Response) => {
        try {
            const templates = microsoftListService.getTemplates();
            return res.status(200).json({
                success: true,
                response: templates
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
};

export { MicrosoftListController };
