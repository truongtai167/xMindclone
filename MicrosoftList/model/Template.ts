import { Column } from "./Column";

export class Template {
    public id: string;
    public name: string;
    public columns: Column[];

    constructor(id: string, name: string, columns: Column[]) {
        this.id = id;
        this.name = name;
        this.columns = columns;
    }
}
