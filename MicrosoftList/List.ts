import { uniqueId } from "lodash"
import { Item } from "./Item"
import { ChoiceColumn, Column, ColumnType, createColumn, DateColumn, NumberColumn, TextColumn, YesNoColumn } from "./Column"
import { ListView, View, viewClassMapping, ViewType } from "./View"



class List {
    public id: string
    public name: string
    public columns: Column[]
    public items: Item[]
    public views: View[]

    constructor(name: string, columns: Column[] = [], views: View[] = []) {
        this.id = uniqueId()
        this.name = name
        this.items = []
        this.columns = columns
        this.views = views
        this.createDefaultView()
    }
    private createDefaultView() {
        const defaultView = new ListView('All items', this.columns, this.items);
        this.addView(defaultView);
    }
    addView(view: View) {
        this.views.push(view);
    }
    addColumn(column: Column) {
        this.columns.push(column);
        this.items.forEach(item => {
            const newColumn = createColumn(column.name, column.type);
            item.addColumn(newColumn);
        });
    }
    removeColumn(name: string) {
        this.columns = this.columns.filter(s => s.name !== name)
        this.items.forEach(item => {
            item.removeColumn(name);
        });
    }
    addItem() {
        const newColumns = this.columns.map(col => createColumn(col.name, col.type));
        const newItem = new Item(newColumns);
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
    setItemColumnValue(itemId: string, columnId: string, value: any) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.setColumnValue(columnId, value);
        }
    }
    createView(name: string, type: ViewType): View {
        const ViewClass = viewClassMapping[type];
        const newView = new ViewClass(name, this.columns, this.items);
        this.addView(newView);
        return newView;
    }

}




export { List }