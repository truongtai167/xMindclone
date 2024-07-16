import { uniqueId } from "lodash";

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

interface BaseColumn {
    id: string
    name: string
    type: ColumnType
}

class TextColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Text;
    value: string;

    constructor(name: string, value: string = '') {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class ImageColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Image;
    value: string;

    constructor(name: string, value: string = '') {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class DateColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Date;
    value: Date | null;

    constructor(name: string, value: Date | null = null) {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class ChoiceColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Choice;
    values: string[];


    constructor(name: string, values: string[] = []) {
        this.id = uniqueId();
        this.name = name;
        this.values = values;
    }
}

class PersonColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Person;
    value: { name: string, email: string };

    constructor(name: string, value: { name: string, email: string } = { name: '', email: '' }) {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class YesNoColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.YesNo;
    value: boolean;

    constructor(name: string, value: boolean = false) {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class NumberColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Number;
    value: number;

    constructor(name: string, value: number = 0) {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

class HyperlinkColumn implements BaseColumn {
    id: string;
    name: string;
    type: ColumnType = ColumnType.Hyperlink;
    value: string; // URL

    constructor(name: string, value: string = '') {
        this.id = uniqueId();
        this.name = name;
        this.value = value;
    }
}

// Union type for all column types
type Column = TextColumn | ImageColumn | DateColumn | ChoiceColumn | PersonColumn | YesNoColumn | NumberColumn | HyperlinkColumn;

export { Column, TextColumn, ImageColumn, DateColumn, ChoiceColumn, PersonColumn, YesNoColumn, NumberColumn, HyperlinkColumn, ColumnType };
