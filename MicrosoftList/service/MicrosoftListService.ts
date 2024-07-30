import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { Column, columnClassMapping } from '../model/Column';
import { Row } from '../model/Row';
import { Template } from '../model/Template';

class MicrosoftListService {
    private model: MicrosoftList;
    private jsonFilePath: string = './MicrosoftList/loadList.json';
    private templateFilePath: string = './MicrosoftList/template.json';


    constructor(model: MicrosoftList) {
        this.model = model;
    }

    loadFile(): MicrosoftList {
        const data = fs.readFileSync(this.jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        const templateData = fs.readFileSync(this.templateFilePath, 'utf8');
        const templateJsonData = JSON.parse(templateData);
        const lists = jsonData.lists.map((list: any) => this.initializeLists(list));
        this.model = new MicrosoftList();
        this.model.lists = lists;
        this.initializeTemplates(templateJsonData);
        this.saveFile(this.model);
        return this.model;
    }

    initializeTemplates(templateJsonData: { id: string, name: string, columns: { id: string, type: string, name: string }[] }[]): void {
        this.model.templates = templateJsonData.map(t =>
            new Template(t.id, t.name, this.createColumnsFromTemplate(t.columns))
        );
    }
    createColumnsFromTemplate(columns: { id: string, type: string, name: string }[]): Column[] {
        return columns.map(col => {
            const ColumnClass = columnClassMapping[col.type];
            if (!ColumnClass) {
                throw new Error(`Unknown column type: ${col.type}`);
            }
            const columnInstance = new ColumnClass(col.name);
            columnInstance.id = col.id;
            return columnInstance;
        });
    }

    getLists() {
        this.loadFile()
        return this.model.lists;
    }
    getListById(listId: string): List | null {
        this.loadFile();
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }
        return list;
    }

    getTemplates() {
        this.loadFile()
        return this.model.templates;
    }
    saveFile(data: any): void {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.jsonFilePath, jsonData, 'utf8');
    }

    createBlankList(name: string): List {
        const blanklist = new List(name);
        this.model.lists.push(blanklist);
        this.saveFile(this.model)
        return blanklist;
    }
    createListFromTemplate(templateId: string, listName: string): List {
        this.loadFile()
        const template = this.model.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`Template with ID ${templateId} not found.`);
        }
        const newList = new List(listName, template.columns)
        this.model.lists.push(newList);
        this.saveFile(this.model)
        return newList;
    }


    deleteList(listId: string): void {
        this.model.lists = this.model.lists.filter(s => s.id !== listId);
        this.saveFile(this.model)
    }
    initializeLists(json: any): List {
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
        this.loadFile()
        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }
        // Add the new column to the list
        list.columns.push(column);
        for (const row of list.rows) {
            const ColumnClass = columnClassMapping[column.type];
            if (!ColumnClass) {
                throw new Error(`Unknown column type: ${column.type}`);
            }

            const newColumnInstance = new ColumnClass(column.name);
            row.columns.push(newColumnInstance);
        }
        this.saveFile(this.model)
        return column;
    }
    deleteColumn(listId: string, columnId: string): void {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return;
        }
        list.columns = list.columns.filter(col => col.id !== columnId);
        list.rows.forEach(row => {
            row.columns = row.columns.filter(col => col.id !== columnId);
        });
        this.saveFile(this.model)
    }

    addRow(listId: string, rowData: { [key: string]: any } = {}): Row | null {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }
        const rowColumns = list.columns.map(col => {
            const ColumnClass = columnClassMapping[col.type];
            if (!ColumnClass) {
                throw new Error(`Unknown column type: ${col.type}`);
            }
            const columnInstance = new ColumnClass(col.name);
            columnInstance.value = rowData[col.id] !== undefined ? rowData[col.id] : null; // Set value from rowData or null
            return columnInstance;
        });

        const newRow = new Row(rowColumns);
        list.rows.push(newRow);
        this.saveFile(this.model)
        return newRow;
    }

    deleteRow(listId: string, rowId: string): void {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return;
        }
        list.rows = list.rows.filter(row => row.id !== rowId);
        console.log(this.model.lists)
        this.saveFile(this.model)
    }
    searchRow(searchTerm: string, listId: string): Row[] {
        this.loadFile()
        const lowerCaseTerm = searchTerm.toLowerCase();
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return [];
        }
        return list.rows.filter(row =>
            row.columns.some(column =>
                column.value?.toString().toLowerCase().includes(lowerCaseTerm)
            )
        );
    }

    filterRow(listId: string, colName: string, values: any[]): Row[] {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return [];
        }
        return list.rows.filter(row => {
            const column = row.columns.find(col => col.name === colName);
            return column ? values.includes(column.value) : false;
        });
    }


    updateRowValue(listId: string, rowId: string, columnId: string, value: any): Row | null {
        this.loadFile();

        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            console.error(`List with ID ${listId} not found.`);
            return null;
        }
        // Find the row by ID
        const row = list.rows.find(r => r.id === rowId);
        if (!row) {
            console.error(`Row with ID ${rowId} not found.`);
            return null;
        }
        // Update the row columns
        const column = row.columns.find(col => col.id === columnId);
        if (!column) {
            console.error(`Column with ID ${columnId} not found.`);
            return null;
        }
        // Update the column value

        console.log('Before Update:', column); // Log before update
        column.value = value;
        console.log('After Update:', column); // Log after update
        // Save changes to the model
        this.saveFile(this.model);
        return row;
    }

    paginateRows(
        listId: string,
        page: number,
        limit: number,
        search?: string,
        colName?: string,
        values?: any[]
    ) {
        this.loadFile();
        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            return null;
        }

        let filteredRows = list.rows;

        // Apply search if searchTerm is provided
        if (search) {
            const lowerCaseTerm = search.toLowerCase();
            filteredRows = filteredRows.filter(row =>
                row.columns.some(column =>
                    column.value?.toString().toLowerCase().includes(lowerCaseTerm)
                )
            );
        }

        // Apply filter if colName and values are provided
        if (colName && values) {
            filteredRows = filteredRows.filter(row => {
                const column = row.columns.find(col => col.name === colName);
                return column ? values.includes(column.value) : false;
            });
        }

        // Calculate pagination indices
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Slice the rows for the current page
        const rows = filteredRows.slice(startIndex, endIndex);

        // Return paginated data
        return {
            rows,
            page,
            limit,
            totalRows: filteredRows.length,
            totalPages: Math.ceil(filteredRows.length / limit)
        };
    }


}

export { MicrosoftListService };
