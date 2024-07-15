import { Column } from "./Column"
import { Item } from "./Item"
import { List } from "./List"
import { Template } from "./Template"
import { TemplateService } from "./TemplateService"

class MicrosoftList {
    public lists: List[]
    public favoriteLists: List[]
    public recentLists: List[]
    public templates: Template[]

    constructor(templates: Template[] = TemplateService.initializeDefaultTemplates()) {
        this.lists = []
        this.favoriteLists = []
        this.recentLists = []
        this.templates = templates
    }
    createBlankList(name: string) {
        const blanklist = new List(name)
        this.lists.push(blanklist)
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
}

const microsoftList = new MicrosoftList();
microsoftList.addTemplateList(microsoftList.templates[0].id, 'Management');
microsoftList.lists[0].addItem()
console.log(microsoftList)
console.log(microsoftList.lists[0].items)



export { MicrosoftList }