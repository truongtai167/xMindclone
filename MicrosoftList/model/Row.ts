import { uniqueId } from "lodash";
import { Column } from "./Column";

export class Row {
    public id: string;
    public columns: Column[];

    constructor(columns: Column[] = []) {
        this.id = uniqueId();
        this.columns = columns
    }
}
