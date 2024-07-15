import { uniqueId } from "lodash"
import { Item } from "./Item"
import { Column, ColumnType } from "./Column"



class List {
    public id: string
    public name: string
    public columns: Column[]
    public items: Item[]

    constructor(name: string, columns: Column[] = []) {
        this.id = uniqueId()
        this.name = name
        this.items = []
        this.columns = columns
    }
    addColumn(name: string, columnType: ColumnType) {
        const newColumn = new Column(name, columnType)
        this.columns.push(newColumn);

    }
    removeColumn(id: string) {
        this.columns = this.columns.filter(s => s.id !== id)
        this.items.forEach(item => {
            item.columns = item.columns.filter(col => col.id !== id);
        });
    }
    addItem() {
        const newItem = new Item(this.columns);
        this.items.push(newItem);
    }
    deleteItem(id: string) {
        this.items = this.items.filter(s => s.id !== id)
    }
    exportCSV(): string {
        return `${this.name}.csv`
    }
    shareLink(): string {
        return `https://example.com/list/${this.name}`
    }
    changeName(name: string) {
        this.name = name
    }
}

const myList = new List("My List", [new Column('Text', ColumnType.Choice)]);
myList.addItem();
myList.addColumn('Day', ColumnType.Date)
console.log(myList);
console.log(myList.items);
console.log(myList.columns);
console.log(myList.items[0].columns);



export { List }