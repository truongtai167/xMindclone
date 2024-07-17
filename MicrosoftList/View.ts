import { uniqueId } from "lodash"
import { Column } from "./Column"
import { Item } from "./Item"

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
    public items: Item[]
    public type: ViewType

    constructor(name: string, columns: Column[], items: Item[], type: ViewType) {
        this.id = uniqueId()
        this.name = name
        this.columns = columns
        this.items = items
        this.type = type
    }
}
class ListView extends View {
    constructor(name: string, columns: Column[], items: Item[]) {
        super(name, columns, items, ViewType.List)
    }
}
class CalendarView extends View {
    constructor(name: string, columns: Column[], items: Item[]) {
        super(name, columns, items, ViewType.Calendar)
    }
}
class GalleryView extends View {
    constructor(name: string, columns: Column[], items: Item[]) {
        super(name, columns, items, ViewType.Gallery)
    }
}
class BoardView extends View {
    constructor(name: string, columns: Column[], items: Item[]) {
        super(name, columns, items, ViewType.Board)
    }
}

const viewClassMapping: Record<ViewType, new (name: string, columns: Column[], items: Item[]) => View> = {
    [ViewType.List]: ListView,
    [ViewType.Calendar]: CalendarView,
    [ViewType.Gallery]: GalleryView,
    [ViewType.Board]: BoardView,
};




export { View, ListView, CalendarView, viewClassMapping, ViewType }