import { List } from "./List"
import { Template } from "./Template"
import { TemplateFactory } from "./TemplateFactory"
import fs from 'fs';


class MicrosoftList {
    public lists: List[]
    public favoriteLists: List[]
    public recentLists: List[]
    public templates: Template[]

    constructor(templates: Template[] = TemplateFactory.initializeDefaultTemplates()) {
        this.lists = []
        this.favoriteLists = []
        this.recentLists = []
        this.templates = templates
    }
    createBlankList(name: string) {
        const blanklist = new List(name)
        this.lists.push(blanklist)
        return blanklist;

    }
    deleteList(listId: string) {
        this.lists = this.lists.filter(s => s.id !== listId);
    }
    importList(importedList: List) {
        this.lists.push(importedList)
    }
    addFavoriteList(listId: string) {
        const list = this.lists.find(list => list.id === listId);
        list && !this.favoriteLists.some(favList => favList.id === listId) && this.favoriteLists.push(list);
    }
    removeFavoriteList(listId: string) {
        this.favoriteLists = this.favoriteLists.filter(list => list.id !== listId);
    }
    addTemplateList(templateId: string, name: string) {
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            const newList = new List(name, template.columns);
            this.lists.push(newList);
        }
    }
    saveListToFile(listId: string, filename: string) {
        const list = this.lists.find(list => list.id === listId);
        if (list) {
            const json = JSON.stringify(list.toJSON(), null, 2);
            fs.writeFileSync(filename, json, 'utf8');
        }
    }
    fromJson(filename: string) {
        const data = fs.readFileSync(filename, 'utf8');
        const jsonData = JSON.parse(data);
        const list = List.fromJSON(jsonData);
        this.lists.push(list);
        return list;
    }

}



export { MicrosoftList }
