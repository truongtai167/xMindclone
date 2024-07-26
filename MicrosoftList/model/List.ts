import { uniqueId } from "lodash";
import { Column, createColumn } from "./Column";
import { Row } from "./Row";
import { View } from "./View";
import { Form } from "./Form";

export class List {
    public id: string;
    public name: string;
    public columns: Column[];
    public rows: Row[];
    public views: View[];
    public forms: Form[];

    constructor(name: string, columns: Column[] = [], views: View[] = [], forms: Form[] = []) {
        this.id = uniqueId();
        this.name = name;
        this.columns = columns;
        this.rows = [];
        this.views = views;
        this.forms = forms;
    }
}
