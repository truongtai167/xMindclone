import { uniqueId } from "lodash";

export class Row {
    public id: string;
    public columns: { [key: string]: any };

    constructor(columns: { [key: string]: any }) {
        this.id = uniqueId();
        this.columns = columns;
    }
}
