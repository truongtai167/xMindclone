import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";

class MicrosoftListService {
    private model: MicrosoftList;
    private jsonFilePath: string;

    constructor(jsonFilePath: string = './testList.json') {
        this.jsonFilePath = jsonFilePath;
        this.model = this.loadFromFile();
    }

    loadFromFile(): Void {
        
    }

    createBlankList(name: string): List {
        const blanklist = new List(name);
        this.model.lists.push(blanklist);
        return blanklist;
    }

    deleteList(listId: string): void {
        this.model.lists = this.model.lists.filter(s => s.id !== listId);
    }

    importList(importedList: List): void {
        this.model.lists.push(importedList);
    }

    addFavoriteList(listId: string): void {
        const list = this.model.lists.find(list => list.id === listId);
        if (list && !this.model.favoriteLists.some(favList => favList.id === listId)) {
            this.model.favoriteLists.push(list);
        }
    }

    removeFavoriteList(listId: string): void {
        this.model.favoriteLists = this.model.favoriteLists.filter(list => list.id !== listId);
    }

    addTemplateList(templateId: string, name: string): void {
        const template = this.model.templates.find(t => t.id === templateId);
        if (template?.columns) {
            this.model.lists.push(new List(name, template.columns));
        }
    }

    createListExisting(listId: string, name: string): void {
        const list = this.model.lists.find(t => t.id === listId);
        if (list?.columns) {
            this.model.lists.push(new List(name, list.columns));
        }
    }

    // saveFile(listId: string, filename: string): void {
    //     const list = this.model.lists.find(list => list.id === listId);
    //     if (list?.toJSON) {
    //         fs.writeFileSync(filename, JSON.stringify(list.toJSON(), null, 2), 'utf8');
    //     }
    // }

    // loadFile(filename: string): List {
    //     const data = fs.readFileSync(filename, 'utf8');
    //     const jsonData = JSON.parse(data);
    //     const list = List.fromJSON(jsonData);
    //     this.model.lists.push(list);
    //     return list;
    // }

    // saveAll(filename: string): void {
    //     const allList = this.model.lists.map(list => list.toJSON());
    //     fs.writeFileSync(filename, JSON.stringify(allList, null, 2), 'utf-8');
    // }
}

export { MicrosoftListService };
