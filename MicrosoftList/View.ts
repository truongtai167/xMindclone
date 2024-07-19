import { uniqueId } from "lodash"
import { Column, createColumn, TextColumn } from "./Column"
import { Row } from "./Row"

enum ViewType {
    List = 'List',
    Calendar = 'Calendar',
    Gallery = 'Gallery',
    Board = 'Board'
}
abstract class View {
    public id: string
    public name: string
    public columns: Column[]
    public rows: Row[]
    public type: ViewType

    constructor(name: string, columns: Column[], rows: Row[], type: ViewType) {
        this.id = uniqueId()
        this.name = name
        this.columns = columns
        this.rows = rows
        this.type = type
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            columns: this.columns.map(col => col.toJSON()),
            rows: this.rows.map(item => item.toJSON())
        };
    }
    addColumn(column: Column) {
        this.columns.push(column);
        this.rows.forEach(item => item.addColumn(createColumn(column.name, column.type)));
    }

    removeColumn(name: string) {
        this.columns = this.columns.filter(col => col.name !== name);
        this.rows.forEach(item => item.removeColumn(name));
    }
    addBoardColumn(column: Column, defaultValue: any) {

    }
    moveColumn(rowId: string, colId: string) {

    }
}
class ListView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.List)
    }
}
class CalendarView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Calendar)
    }
}
class GalleryView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Gallery)
    }
}
class BoardView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Board)
    }
    addBoardColumn(column: Column, defaultValue: any) {
        this.addColumn(column);
        column.value = defaultValue
    }
    moveColumn(rowId: string, colId: string): void {
        const row = this.rows.find(item => item.id === rowId);
        const col = this.columns.find(item => item.id === colId);
        // Optional chaining and logical AND to handle the operation without explicit if checks
        row && col && row.columns
            .filter(item => item.name === col.name)
            .forEach(item => item.value = col.value);
    }
}

const viewClassMapping: Record<ViewType, new (name: string, columns: Column[], rows: Row[]) => View> = {
    [ViewType.List]: ListView,
    [ViewType.Calendar]: CalendarView,
    [ViewType.Gallery]: GalleryView,
    [ViewType.Board]: BoardView,
};




export { View, ListView, CalendarView, viewClassMapping, ViewType, BoardView }