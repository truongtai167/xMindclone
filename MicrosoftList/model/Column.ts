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
    Hyperlink = "Hyperlink",
    Rating = "Rating"
}

abstract class Column {
    public id: string;
    public name: string;
    public type: ColumnType;
    public visible: boolean

    constructor(name: string, type: ColumnType) {
        this.id = uniqueId();
        this.name = name;
        this.type = type;
        this.visible = true
    }

    abstract validateValue(value: any): boolean;
    abstract formatValue(value: any): any;
}

class TextColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Text)
    }
    validateValue(value: any): boolean {
        return typeof value === 'string';
    }

    formatValue(value: any): any {
        return value.toString();
    }

}

class ImageColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Image)
    }
    validateValue(value: any): boolean {
        // Assuming URL validation for images
        return typeof value === 'string' && value.startsWith('http');
    }

    formatValue(value: any): any {
        return value.toString();
    }

}

class DateColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Date)
    }

    validateValue(value: any): boolean {
        return !isNaN(Date.parse(value));
    }

    formatValue(value: any): any {
        return new Date(value);
    }
}

class ChoiceColumn extends Column {
    public choices: string[];

    constructor(name: string, choices: string[] = []) {
        super(name, ColumnType.Choice);
        this.choices = choices;
    }
    validateValue(value: any): boolean {
        return this.choices.includes(value);
    }

    formatValue(value: any): any {
        return value;
    }

}

class PersonColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Person)
    }

    validateValue(value: any): boolean {
        return typeof value === 'string';
    }

    formatValue(value: any): any {
        return value.toString();
    }
}

class YesNoColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.YesNo)
    }
    validateValue(value: any): boolean {
        return typeof value === 'boolean';
    }

    formatValue(value: any): any {
        return value;
    }
}

class NumberColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Number)
    }
    validateValue(value: any): boolean {
        return typeof value === 'number';
    }

    formatValue(value: any): any {
        return Number(value);
    }
}

class HyperlinkColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Hyperlink)
    }
    validateValue(value: any): boolean {
        return typeof value === 'string' && value.startsWith('http');
    }

    formatValue(value: any): any {
        return value.toString();
    }
}
class RatingColumn extends Column {
    constructor(name: string) {
        super(name, ColumnType.Rating)
    }

    validateValue(value: any): boolean {
        return typeof value === 'number' && value >= 0 && value <= 5; // Assuming rating is between 0 and 5
    }

    formatValue(value: any): any {
        return Number(value);
    }
}
interface ColumnConfig {
    settingName: string;
    settingValue: any;
}

const formatters: { [key: string]: (value: string, columnName: string) => any } = {
    'Hyperlink': (value, columnName) => {
        const [url, displayText] = value.split(','); // Assuming value is in "url,displayText" format
        return { columnName, url, displayText };
    },
    // Add other column type formatters here
    'Text': (value, columnName) => {
        return { columnName, value };
    },
    'Choice': (value, columnName) => {
        if (value) {
            const choices = value.split(','); // Split the comma-separated choices
            return { columnName, choices };
        }
        return { columnName, choices: [] }; // Default for null or undefined values
    },
    // Default formatter if none of the above match
    'default': (value, columnName) => {
        return { columnName, value };
    }
};

const valueProcessors: { [key: string]: (value: string) => any } = {
    'Choice': (value: string) => value.split(',').map(choice => choice.trim()).join(','),
    'Hyperlink': (value: string) => {
        const [url, displayText] = value.split(',');
        return { url: url.trim(), displayText: displayText.trim() };
    },
    // Add other column type processors as needed
};


type ColumnConstructor = new (name: string, ...args: any[]) => Column;

// Define the mapping for column types
const columnCreationMapping: Record<ColumnType, ColumnConstructor> = {
    [ColumnType.Text]: TextColumn,
    [ColumnType.Number]: NumberColumn,
    [ColumnType.Choice]: ChoiceColumn,
    [ColumnType.Hyperlink]: HyperlinkColumn,
    [ColumnType.Person]: PersonColumn,
    [ColumnType.YesNo]: YesNoColumn,
    [ColumnType.Image]: ImageColumn,
    [ColumnType.Date]: DateColumn,
    [ColumnType.Rating]: RatingColumn
};


export { Column, TextColumn, ImageColumn, DateColumn, ChoiceColumn, PersonColumn, YesNoColumn, NumberColumn, HyperlinkColumn, RatingColumn, ColumnType, columnCreationMapping, ColumnConfig, formatters, valueProcessors };