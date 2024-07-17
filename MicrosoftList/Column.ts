import { extend, uniqueId } from "lodash";

// Enum for column types
enum ColumnType {
    Text = "Text",
    Image = "Image",
    Date = "Date",
    Choice = "Choice",
    Person = "Person",
    YesNo = "Yes/No",
    Number = "Number",
    Hyperlink = "Hyperlink"
}

abstract class Column {
    public id: string;
    public name: string;
    public type: ColumnType;
    public value: any;

    constructor(name: string, type: ColumnType) {
        this.id = uniqueId();
        this.name = name;
        this.type = type;
        this.value = null;
    }

    abstract setValue(value: any): void;
}

class TextColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Text)
    }
    setValue(value: any): void {
        this.value = value.toString();
    }
}

class ImageColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Image)
    }
    setValue(value: any): void {
        this.value = value.toString();
    }
}

class DateColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Date)
    }
    setValue(value: any): void {
        this.value = new Date(value);
    }
}

class ChoiceColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Choice)
    }
    setValue(value: any): void {
        this.value = value;
    }
}

class PersonColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Person)
    }
    setValue(value: any): void {
        this.value = value.toString();
    }
}

class YesNoColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.YesNo)
    }
    setValue(value: boolean): void {
        this.value = new Boolean(value);
    }
}

class NumberColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Number)
    }
    setValue(value: any): void {
        this.value = new Number(value);
    }
}

class HyperlinkColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Hyperlink)
    }
    setValue(value: any): void {
        this.value = value.toString();
    }
}


const columnClassMapping: Record<ColumnType, new (name: string) => Column> = {
    [ColumnType.Text]: TextColumn,
    [ColumnType.Image]: ImageColumn,
    [ColumnType.Date]: DateColumn,
    [ColumnType.Choice]: ChoiceColumn,
    [ColumnType.Person]: PersonColumn,
    [ColumnType.YesNo]: YesNoColumn,
    [ColumnType.Number]: NumberColumn,
    [ColumnType.Hyperlink]: HyperlinkColumn
};

function createColumn(name: string, columnType: ColumnType): Column {
    const ColumnClass = columnClassMapping[columnType];
    return new ColumnClass(name);
}


export { Column, TextColumn, ImageColumn, DateColumn, ChoiceColumn, PersonColumn, YesNoColumn, NumberColumn, HyperlinkColumn, ColumnType, createColumn };
