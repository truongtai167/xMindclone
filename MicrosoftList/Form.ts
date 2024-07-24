import { uniqueId } from "lodash"
import { IList } from "./Interface"

class Form {
    public id: string
    public name: string
    public list: IList

    constructor(name: string, list: IList) {
        this.id = uniqueId()
        this.name = name
        this.list = list
    }

    submitForm(columnValues: { [columnId: string]: any } = {}) {
        return this.list.addRow(columnValues)
    }

}
export { Form }



