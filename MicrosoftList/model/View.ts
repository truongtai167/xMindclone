import { uniqueId } from "lodash";
import { Column } from "./Column";
import { Row } from "./Row";

export enum ViewType {
    List = 'List',
    Calendar = 'Calendar',
    Gallery = 'Gallery',
    Board = 'Board'
}

export class View {
    public id: string;
    public name: string;
    public columns: Column[];
    public rows: Row[];
    public type: ViewType;

    constructor(name: string, columns: Column[], rows: Row[], type: ViewType) {
        this.id = uniqueId();
        this.name = name;
        this.columns = columns;
        this.rows = rows;
        this.type = type;
    }
}

export class ListView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.List);
    }
}

export class CalendarView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Calendar);
    }
}

export class GalleryView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Gallery);
    }
}

export class BoardView extends View {
    constructor(name: string, columns: Column[], rows: Row[]) {
        super(name, columns, rows, ViewType.Board);
    }
}
