import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { Row } from '../model/Row';
import { createColumn } from '../model/Column';

class ListService {
    private model: List;

    constructor() {
        this.model = new List('abc')
    }
    fromJSON(json: any): List {
        const list = new List(json.name);
        list.id = json.id;
        list.columns = json.columns.map((col: any) => (col.name, col.type));
        list.rows = json.rows.map((row: any) => {
            const columns = row.columns.map((col: any) => {
                const column = createColumn(col.name, col.type);
                column.id = col.id;
                column.setValue(col.value);
                return column;
            });
            const newRow = new Row(columns);
            newRow.id = row.id;
            return newRow;
        });
        return list;
    }
}
export { ListService };
