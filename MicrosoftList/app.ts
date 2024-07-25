    import express from 'express';
    import bodyParser from 'body-parser';
    import { MicrosoftListController } from '../MicrosoftList/controller/MircrosoftlistController';

    const app = express();
    const port = 3000;

    app.use(bodyParser.json());

    // Define routes and associate with the controller methods
    app.post('/api/lists', MicrosoftListController.createBlankList);
    // app.delete('/api/lists/:id', MicrosoftListController.deleteList);
    // app.post('/api/lists/import', MicrosoftListController.importList);
    // app.post('/api/lists/:id/favorite', MicrosoftListController.addFavoriteList);
    // app.delete('/api/lists/:id/favorite', MicrosoftListController.removeFavoriteList);
    // app.post('/api/lists/template', MicrosoftListController.addTemplateList);
    // app.post('/api/lists/existing', MicrosoftListController.createListExisting);
    // app.post('/api/lists/:id/save', MicrosoftListController.saveFile);
    // app.post('/api/lists/load', MicrosoftListController.loadFile);
    // app.post('/api/lists/saveAll', MicrosoftListController.saveAll);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
