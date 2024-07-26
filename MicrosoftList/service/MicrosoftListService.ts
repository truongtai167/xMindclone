import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { ListService } from './ListService';
import { Column, columnClassMapping } from '../model/Column';
import { Row } from '../model/Row';

class MicrosoftListService {
    private model: MicrosoftList;
    private jsonFilePath: string;

    constructor(jsonFilePath: string = './MicrosoftList/loadList.json') {
        this.jsonFilePath = jsonFilePath;
        this.model = this.loadFile();
    }

    loadFile(): MicrosoftList {
        const data = fs.readFileSync(this.jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        const lists = jsonData.lists.map((list: any) => this.fromJSON(list));
        this.model = new MicrosoftList();
        this.model.lists = lists;
        return this.model;
    }

    getLists() {
        return this.model.lists;
    }
    saveFile(): void {
        const jsonData = {
            lists: this.model.lists.map(list => {
                return {
                    id: list.id,
                    name: list.name,
                    columns: list.columns.map(col => ({
                        id: col.id,
                        name: col.name,
                        type: col.type,
                        value: col.value
                    })),
                    rows: list.rows.map(row => ({
                        id: row.id,
                        columns: row.columns.map(col => ({
                            id: col.id,
                            name: col.name,
                            type: col.type,
                            value: col.value
                        }))
                    }))
                };
            })
        };

        fs.writeFileSync(this.jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    }

    createBlankList(name: string): List {
        const blanklist = new List(name);
        this.model.lists.push(blanklist);
        this.saveFile()
        console.log(this.model.lists)
        return blanklist;
    }

    deleteList(listId: string): void {
        this.model.lists = this.model.lists.filter(s => s.id !== listId);
        this.saveFile()
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

    addColumn(listId: string, column: Column): Column | null {
        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        console.log(this.model.lists)
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }

        // Add the new column to the list
        list.columns.push(column);

        // Save the updated model to file
        this.saveFile();



        // Return the added column
        return column;
    }

}

export { MicrosoftListService };
