import { uniqueId } from "lodash";
import { Column } from "./Column";

export class Template {
    public id: string;
    public name: string;
    public columns: Column[];

    constructor(name: string, columns: Column[]) {
        this.id = uniqueId();
        this.name = name;
        this.columns = columns;
    }
}
