import { uniqueId } from "lodash"
import { Column } from "./Column"
import { Comment } from "./Comment"

class Item {
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
}

export { Item }