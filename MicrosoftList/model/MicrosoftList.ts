import { List } from "./List"
import { Template } from "./Template"


class MicrosoftList {
    public lists: List[]
    public favoriteLists: List[]
    public recentLists: List[]
    public templates: Template[]

    constructor(templates: Template[] = []) {
        this.lists = []
        this.favoriteLists = []
        this.recentLists = []
        this.templates = templates
    }
}

export { MicrosoftList }