import { uniqueId } from "lodash"
import { Column } from "./Column"
import { Commentt } from "./Comment"

class Item {
    public id: string
    public columns: Column[];
    public comments: Commentt[]

    constructor(columns: Column[] = [], comments: Commentt[] = []) {
        this.id = uniqueId()
        this.columns = columns
        this.comments = comments
    }
    addComment() {

    }
    deleteComment() {

    }
}

export { Item }