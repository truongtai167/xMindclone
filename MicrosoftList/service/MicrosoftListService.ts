import fs from 'fs';
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { Column, columnCreationMapping, ColumnType } from '../model/Column';
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
                const ColumnClass = columnCreationMapping[col.type];
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

        // Initialize columns
        list.columns = json.columns.map((col: any) => {
            // Get the Column class from the mapping
            const ColumnClass = columnCreationMapping[col.type];
            if (!ColumnClass) {
                throw new Error(`Unknown column type: ${col.type}`);
            }

            // Create a new column instance
            const columnInstance = new ColumnClass(col.name, col.choices || []);

            columnInstance.id = col.id;
            return columnInstance;
        });

        // Initialize rows
        list.rows = json.rows.map((row: any) => {
            // Create a mapping of column IDs to values
            const datas = row.data.map(col => {
                return {
                    colName: col.colName,
                    value: col.value
                };
            });
            // Create the Row instance with the data
            const rowInstance = new Row(datas);
            rowInstance.id = row.id;
            return rowInstance;
        });
        return list;
    }


    getLists() {
        this.loadFile();
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
        this.loadFile();
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
        this.saveFile(this.model);
        return blanklist;
    }

    createListFromTemplate(templateId: string, listName: string): List {
        this.loadFile();
        const template = this.model.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`Template with ID ${templateId} not found.`);
        }
        if (!listName) {
            throw new Error("List name cannot be empty");
        }
        const newList = new List(listName, template.columns);
        this.model.lists.push(newList);
        this.saveFile(this.model);
        return newList;
    }

    deleteList(listId: string): void {
        const deletelist = this.model.lists.find(s => s.id === listId);
        if (!deletelist) {
            throw new Error(`List with ID ${listId} not found`);
        }
        this.model.lists = this.model.lists.filter(s => s.id !== listId);
        this.saveFile(this.model);
    }

    addColumn(listId: string, name: string, type: string, choices: any): Column | null {
        this.loadFile();

        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Validate and convert column type
        const columnType = ColumnType[type as keyof typeof ColumnType];

        const ColumnClass = columnCreationMapping[columnType];

        const columnExists = list.columns.some(col => col.name === name);
        if (columnExists) {
            throw new Error(`A column with the name "${name}" already exists.`);
        }
        const parsedChoices = typeof choices === 'string'
            ? choices.split(',').map(choice => choice.trim())
            : choices;

        const newColumn = new ColumnClass(name, parsedChoices);

        // Add the new column to the list
        list.columns.push(newColumn);
        // Add the new column to each row
        list.rows.forEach(row => {
            row.data.push({
                colName: newColumn.name,
                value: null // Initialize value to null
            });
        });

        // Save the updated model
        this.saveFile(this.model);

        return newColumn;
    }

    deleteColumn(listId: string, columnId: string): void {
        this.loadFile();
        const list = this.model.lists.find(l => l.id === listId);

        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        list.columns = list.columns.filter(col => col.id !== columnId);
        list.rows.forEach(row => {
            row.data = row.data.filter(cv => cv.id !== columnId);
        });
        this.saveFile(this.model);
    }

    addRow(listId: string, rowData: { colName: string, value: any }[]): Row | null {
        this.loadFile();

        // Find the list by ID
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Create a new row with column data
        const newRowData = list.columns.map(col => {
            // Find the corresponding value for the column name
            const columnValue = rowData.find(data => data.colName === col.name);
            return {
                colName: col.name,
                value: columnValue ? columnValue.value : null // Use the value if found, otherwise null
            };
        });

        // Create and add the new row to the list
        const newRow = new Row(newRowData);
        list.rows.push(newRow);

        // Save the updated model
        this.saveFile(this.model);

        return newRow;
    }

    deleteRow(listId: string, rowId: string): void {
        this.loadFile();
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        list.rows = list.rows.filter(row => row.id !== rowId);
        this.saveFile(this.model);
    }

    searchRow(searchTerm: string, listId: string): Row[] {
        this.loadFile();
        const lowerCaseTerm = searchTerm.toLowerCase();
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        return list.rows.filter(row =>
            row.data.some(columnData =>
                // Ensure columnData.value is not null or undefined before converting to string
                columnData.value?.toString().toLowerCase().includes(lowerCaseTerm)
            )
        );
    }

    filterRow(listId: string, colName: string, values: any[]): Row[] {
        this.loadFile();
        const list = this.model.lists.find(l => l.id === listId);
        if (!list) {
            throw new Error(`List with ID ${listId} not found.`);
        }
        return list.rows.filter(row => {
            const columnData = row.data.find(data => data.colName === colName);
            return columnData ? values.includes(columnData.value) : false;
        });
    }

    updateRowValue(listId: string, rowId: string, columnName: string, value: any): Row | null {
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
        // Update the row column value
        const column = list.columns.find(col => col.name === columnName);
        const columnData = row.data.find(d => d.colName === columnName);
        if (!(column?.validateValue(value))) {
            throw new Error(`Invalid value `);
        }
        columnData.value = value;
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

        // Get all rows
        let rows = list.rows;

        // Apply search filter
        if (search) {
            rows = this.searchRow(search, listId);
        }

        // Apply column filter
        if (colName && values) {
            rows = this.filterRow(listId, colName, values);
        }

        // Paginate rows
        const startIndex = (page - 1) * limit;
        const paginatedRows = rows.slice(startIndex, startIndex + limit);

        return {
            total: rows.length,
            page,
            limit,
            rows: paginatedRows
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
            throw new Error(`Column with ID ${columnId} not found.`);
        }

        // Update column properties
        column.name = name;
        column.type = ColumnType[type as keyof typeof ColumnType];

        // Update column in rows
        list.rows.forEach(row => {
            if (row.data[columnId] !== undefined) {
                row.data[columnId] = row.data[columnId]; // Ensure value is updated if necessary
            }
        });

        this.saveFile(this.model);
        return column;
    }
}

export { MicrosoftListService };
