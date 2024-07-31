import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { Column, columnClassMapping, ColumnType } from '../model/Column';
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
        this.model.templates = templateJsonData.map(t => {
            const columns = t.columns.map(col => {
                const ColumnClass = columnClassMapping[col.type];
                if (!ColumnClass) {
                    throw new Error(`Unknown column type: ${col.type}`);
                }
                const columnInstance = new ColumnClass(col.name);
                columnInstance.id = col.id;
                return columnInstance;
            });

            return new Template(t.id, t.name, columns);
        });
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
        if (!name) {
            throw new Error("List name cannot be empty");
        }
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
        if (!listName) {
            throw new Error("List name cannot be empty");
        }
        const newList = new List(listName, template.columns)
        this.model.lists.push(newList);
        this.saveFile(this.model)
        return newList;
    }


    deleteList(listId: string): void {
        const deletelist = this.model.lists.find(s => s.id === listId)
        if (!deletelist) {
            throw new Error(`List with ID ${listId} not found`);
        }
        this.model.lists = this.model.lists.filter(s => s.id !== listId);
        this.saveFile(this.model)
    }


    addColumn(listId: string, name: string, type: string): Column | null {
        this.loadFile();


        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        // Validate and convert column type
        const columnType = ColumnType[type as keyof typeof ColumnType];
        // Create a new column instance
        const ColumnClass = columnClassMapping[columnType];
        if (!ColumnClass) {
            throw new Error(`Unknown column class for type: ${columnType}`);
        }

        const newColumn = new ColumnClass(name);
        // Add the new column to the list's columns
        list.columns.push(newColumn);

        // Add the new column to each row
        list.rows.forEach(row => {
            const newColumnInstance = new ColumnClass(name);
            // Copy the new column's ID from the list's columns to maintain consistency
            row.columns.push(newColumnInstance);
        });

        // Save the updated model
        this.saveFile(this.model);

        return newColumn;
    }
    deleteColumn(listId: string, columnId: string): void {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        const columnToDelete = list.columns.find(col => col.id === columnId);
        list.columns = list.columns.filter(col => col.id !== columnId);
        list.rows.forEach(row => {
            row.columns = row.columns.filter(col => col.name !== columnToDelete?.name);
        });
        this.saveFile(this.model)
    }

    addRow(listId: string, rowData: { [key: string]: any } = {}): Row | null {
        this.loadFile()
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
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
            throw new Error(`List with ID ${listId} not found.`);
        }
        list.rows = list.rows.filter(row => row.id !== rowId);
        this.saveFile(this.model)
    }
    searchRow(searchTerm: string, listId: string): Row[] {
        this.loadFile()
        const lowerCaseTerm = searchTerm.toLowerCase();
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
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
            throw new Error(`List with ID ${listId} not found.`);
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
            throw new Error(`List with ID ${listId} not found.`);
        }
        // Find the row by ID
        const row = list.rows.find(r => r.id === rowId);
        if (!row) {
            throw new Error(`Row with ID ${rowId} not found.`);
        }
        // Update the row columns
        const column = row.columns.find(col => col.id === columnId);
        if (!column) {
            throw new Error(`Column with ID ${columnId} not found.`);
        }
        // Update the column value

        column.value = value;
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
            throw new Error(`List with ID ${listId} not found.`);
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

    updateColumn(listId: string, columnId: string, name: string, type: string): Column | null {
        this.loadFile();

        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Find the column by ID
        const column = list.columns.find(col => col.id === columnId);
        if (!column) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Update column properties
        list.rows.forEach(row => {
            const existingColumn = row.columns.find(col => col.name === column.name);
            if (existingColumn) {
                existingColumn.name = name
                const columnType = ColumnType[type as keyof typeof ColumnType];
                existingColumn.type = columnType
            }
        });

        const columnType = ColumnType[type as keyof typeof ColumnType];
        column.name = name;
        column.type = columnType;
        // Update the column in all rows

        this.saveFile(this.model);
        return column;
    }


}

export { MicrosoftListService };
