import { uniqueId } from "lodash"
import { Row } from "./Row"
import { Column, createColumn } from "./Column"
import { BoardView, ListView, View, viewClassMapping, ViewType } from "./View"



class List {
    public id: string
    public name: string
    public columns: Column[]
    public rows: Row[]
    public views: View[]

    constructor(name: string, columns: Column[] = [], views: View[] = []) {
        this.id = uniqueId()
        this.name = name
        this.rows = []
        this.columns = columns
        this.views = views
        this.createDefaultView()
    }
    private createDefaultView() {
        const defaultView = new ListView('All items', this.columns, this.rows);
        this.addView(defaultView);
    }
    addView(view: View) {
        this.views.push(view);
    }
    addColumn(column: Column) {
        this.columns.push(column);
        this.rows.forEach(item => {
            const newColumn = createColumn(column.name, column.type);
            item.addColumn(newColumn);
        });
        return column
    }
    removeColumn(name: string) {
        this.columns = this.columns.filter(s => s.name !== name)
        this.rows.forEach(item => {
            item.removeColumn(name);
        });
    }
    addRow(columnValues: { [columnId: string]: any } = {}) {
        const newColumns = this.columns.map(col => {
            const column = createColumn(col.name, col.type);
            if (columnValues[col.id]) {
                column.value = columnValues[col.id];
            }
            return column;
        });
        const newItem = new Row(newColumns);
        this.rows.push(newItem);
        return newItem
    }
    deleteRow(id: string) {
        this.rows = this.rows.filter(s => s.id !== id)
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
        const item = this.rows.find(item => item.id === itemId);
        if (item) {
            item.setColumnValue(columnId, value);
        }
    }
    searchRow(searchTerm: string): Row[] {
        const lowerCase = searchTerm.toLowerCase()

        return this.rows.filter(row =>
            row.columns.some(column =>
                column.value?.toString().toLowerCase().includes(lowerCase)
            )
        )
    }
    filterRow(colName: string, values: any[]): Row[] {
        return this.rows.filter(row => {
            const column = row.columns.find(col => col.name === colName)
            return column ? values.includes(column.value) : false;
        })
    }
    createView(name: string, type: ViewType): View {
        const ViewClass = viewClassMapping[type];
        const newView = new ViewClass(name, this.columns, this.rows);
        this.addView(newView);
        return newView;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            columns: this.columns.map(col => col.toJSON()),
            rows: this.rows.map(row => row.toJSON()),
            views: this.views.map(view => view.toJSON())
        };
    }

    static fromJSON(json: any): List {
        const list = new List(json.name);
        list.id = json.id;
        list.columns = json.columns.map((col: any) => createColumn(col.name, col.type));
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

    getRowsPage(pageNumber: number, pageSize: number): Row[] {
        const startIndex = (pageNumber - 1) * pageSize
        return this.rows.slice(startIndex, startIndex + pageSize)
    }


    addColumnWithDefault(column: Column, defaultValue: any) {
        this.columns.push(column);
        this.rows.forEach(item => {
            const newColumn = createColumn(column.name, column.type);
            newColumn.value = defaultValue;
            item.addColumn(newColumn);
        });
        return column;
    }
    addBoardColumn(column: Column, defaultValue: any) {
        // Set the default value for the column
        column.value = defaultValue;

        // Add the column to the main list and all rows
        this.addColumnWithDefault(column, defaultValue);

        // Update the BoardView specifically
        this.views.forEach(view => {
            if (view instanceof BoardView) {
                view.addBoardColumn(column, defaultValue);
            }
        });
    }

}



export { List }
