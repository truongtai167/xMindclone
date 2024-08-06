import { uniqueId } from "lodash";
import { Column } from "./Column";
import { Row } from "./Row";

export class List {
    public id: string;
    public name: string;
    public columns: Column[];
    public rows: Row[];


    constructor(name: string, columns: Column[] = []) {
        this.id = uniqueId();
        this.name = name;
        this.columns = columns;
        this.rows = [];
    }
}
