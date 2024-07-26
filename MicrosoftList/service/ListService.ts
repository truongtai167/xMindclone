import { List } from "../model/List";
import { Row } from "../model/Row";
import { Column, columnClassMapping, createColumn } from "../model/Column";
import { View, viewClassMapping, ViewType } from '../model/View';
import { Form } from '../model/Form';
import fs from 'fs';


class ListService {

    private jsonFilePath: string;

    constructor(jsonFilePath: string = './MicrosoftList/loadList.json') {
        this.jsonFilePath = jsonFilePath;
    }

    addColumn(listId: string, column: Column): Column | null {
        const data = this.loadFromFile();
        const listData = data.lists.find(l => l.id === listId);
        if (!listData) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }
        const list = this.fromJSON(listData);
        list.columns.push(column);
        list.rows.forEach(row => {
            row.columns[column.id] = null; // Initialize new column value
        });
        data.lists = data.lists.map((l: any) => (l.id === listId ? list : l));
        this.saveToFile(data);
        return column;
    }

    fromJSON(json: any): List {
        const list = new List(json.name);
        list.id = json.id;

        // Columns
        list.columns = json.columns.map((col: any) => {
            const ColumnClass = columnClassMapping[col.type];
            if (!ColumnClass) {
                throw new Error(`Unknown column type: ${col.type}`);
            }
            const columnInstance = new ColumnClass(col.name);
            columnInstance.id = col.id; // Set the id from JSON
            columnInstance.value = col.value; // Set the value from JSON
            return columnInstance;
        });

        // Rows
        list.rows = json.rows.map((row: any) => {
            const rowColumns = row.columns.map((col: Column) => {
                const columnValue = row.columns.find((colValue: any) => colValue.id === col.id)?.value;
                const ColumnClass = columnClassMapping[col.type];
                if (!ColumnClass) {
                    throw new Error(`Unknown column type: ${col.type}`);
                }
                const columnInstance = new ColumnClass(col.name);
                columnInstance.id = col.id;
                columnInstance.value = columnValue;
                return columnInstance;
            });
            const rowInstance = new Row(rowColumns);
            rowInstance.id = row.id;
            return rowInstance;
        });
        return list;
    }


    saveToFile(data: any): void {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(this.jsonFilePath, jsonData, 'utf8');
        } catch (error) {
            console.error("Error saving file:", error);
        }
    }
    loadFromFile(): any {
        try {
            const data = fs.readFileSync(this.jsonFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error loading file:", error);
        }
    }

}

export { ListService };
