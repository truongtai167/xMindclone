import { uniqueId } from "lodash"
import { Column } from "./Column"

class Row {
    public id: string
    public columns: Column[];

    constructor(columns: Column[] = []) {
        this.id = uniqueId()
        this.columns = columns
    }

    setColumnValue(colId: string, value: any) {
        const col = this.columns.find(col => col.id === colId)
        col?.setValue(value)
    }
    addColumn(column: Column) {
        this.columns.push(column);
    }

    removeColumn(name: string) {
        this.columns = this.columns.filter(col => col.name !== name);
    }
    toJSON() {
        return {
            id: this.id,
            columns: this.columns.map(col => col.toJSON())
        };
    }
}

export { Row }