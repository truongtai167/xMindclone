import { uniqueId } from "lodash";

// Enum for column types
enum ColumnType {
    Text = "Text",
    Image = "Image",
    Location = "Location",
    Date = "Date",
    Choice = "Choice",
    Person = "Person",
    YesNo = "Yes/No",
    Number = "Number",
    Hyperlink = "Hyperlink"
}

class Column {
    public id: string;
    public name: string;
    public content: string;
    public type: ColumnType;

    constructor(name: string, type: ColumnType, content: string = '') {
        this.id = uniqueId();
        this.name = name;
        this.content = content;
        this.type = type;
    }

    changeName(newName: string) {
        this.name = newName;
    }

    changeContent(newContent: string) {
        this.content = newContent;
    }

    changeType(newType: ColumnType) {
        this.type = newType;
    }

}

export { Column, ColumnType };
