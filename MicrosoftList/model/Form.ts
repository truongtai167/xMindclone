import { uniqueId } from "lodash"
import { Column } from "./Column"
import { IList } from "./Interface"

class Form {
    public id: string
    public name: string
    public columns: Column[]
    private list: IList

    constructor(name: string, columns: Column[], list: IList) {
        this.id = uniqueId()
        this.name = name
        this.columns = columns
        this.list = list
    }


}
export { Form }



