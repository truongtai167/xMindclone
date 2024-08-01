import { uniqueId } from "lodash";
import { Column } from "./Column";

export class Row {
    public id: string;
    public data: Record<string, any>;

    constructor(columnValues: Record<string, any>) {
        this.id = uniqueId();
        this.data = columnValues;
    }
}
