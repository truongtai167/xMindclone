import { uniqueId } from "lodash"
import { Column } from "./Column"
import { Comment } from "./Comment"

class Row {
    public id: string
    public columns: Column[];
    public comments: Comment[]

    constructor(columns: Column[] = [], comments: Comment[] = []) {
        this.id = uniqueId()
        this.columns = columns
        this.comments = comments
    }
    addComment() {

    }
    deleteComment() {

    }
    setColumnValue(colId: string, value: any) {
        const col = this.columns.find(col => col.id === colId)
        if (col) {
            col.setValue(value)
        }
    }
    addColumn(column: Column) {
        this.columns.push(column);
    }

    removeColumn(name: string) {
        this.columns = this.columns.filter(col => col.name !== name);
    }
}

export { Row }