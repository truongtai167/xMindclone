import sql from 'mssql';
import { connect } from '../db'; // Adjust the path as necessary
import { List } from "../model/List";
import { MicrosoftList } from "../model/MicrosoftList";
import { Column, ColumnConfig, columnCreationMapping, ColumnType, formatters } from '../model/Column';
import { Row } from '../model/Row';
import { Template } from '../model/Template';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

class MicrosoftListService {
    private model: MicrosoftList;

    constructor(model: MicrosoftList) {
        this.model = model;
    }

    private async executeQuery(query: string, params: any[] = []): Promise<any> {
        const pool = await connect(); // Use the connect function from db.ts
        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        return request.query(query);
    }

    async getLists(): Promise<any[]> {
        // Query to get lists along with their columns and column settings
        const query = `
            SELECT 
                l.id AS listId, 
                l.name AS listName, 
                c.id AS columnId,
                c.name AS columnName,
                c.type AS columnType,
                cf.settingName AS settingName,
                cf.settingValue AS settingValue
            FROM Lists l
            LEFT JOIN Columns c ON l.id = c.listId
            LEFT JOIN ColumnConfigs cf ON c.id = cf.columnId
        `;

        const result = await this.executeQuery(query);

        // Process the results to group columns and settings under their respective lists
        const listsMap: { [key: string]: any } = {};

        result.recordset.forEach(row => {
            if (!listsMap[row.listId]) {
                listsMap[row.listId] = {
                    id: row.listId,
                    name: row.listName,
                    columns: []
                };
            }

            if (row.columnId) {
                // Find or create column
                let column = listsMap[row.listId].columns.find(col => col.id === row.columnId);
                if (!column) {
                    column = {
                        id: row.columnId,
                        name: row.columnName,
                        type: row.columnType,
                        settings: []
                    };
                    listsMap[row.listId].columns.push(column);
                }

                // Add settings to the column
                if (row.settingName) {
                    column.settings.push({
                        name: row.settingName,
                        value: row.settingValue
                    });
                }
            }
        });

        // Convert listsMap to an array of lists
        return Object.values(listsMap);
    }


    async getListById(listId: string): Promise<any> {
        // Query to get a list by ID along with its columns and column settings
        const query = `
            SELECT 
                l.id AS listId, 
                l.name AS listName, 
                c.id AS columnId,
                c.name AS columnName,
                c.type AS columnType,
                cf.settingName AS settingName,
                cf.settingValue AS settingValue
            FROM Lists l
            LEFT JOIN Columns c ON l.id = c.listId
            LEFT JOIN ColumnConfigs cf ON c.id = cf.columnId
            WHERE l.id = @listId
        `;

        const result = await this.executeQuery(query, [{ name: 'listId', type: sql.NVarChar, value: listId }]);

        // Process the results to group columns and settings under their respective list
        const listsMap: { [key: string]: any } = {};

        result.recordset.forEach(row => {
            if (!listsMap[row.listId]) {
                listsMap[row.listId] = {
                    id: row.listId,
                    name: row.listName,
                    columns: []
                };
            }

            if (row.columnId) {
                // Find or create column
                let column = listsMap[row.listId].columns.find(col => col.id === row.columnId);
                if (!column) {
                    column = {
                        id: row.columnId,
                        name: row.columnName,
                        type: row.columnType,
                        settings: []
                    };
                    listsMap[row.listId].columns.push(column);
                }

                // Add settings to the column
                if (row.settingName) {
                    column.settings.push({
                        name: row.settingName,
                        value: row.settingValue
                    });
                }
            }
        });

        // Return the processed list data
        return listsMap[listId] || null; // Return null if the list is not found
    }


    async getTemplates(): Promise<any> {
        // Query to get all templates along with their columns and column settings
        const query = `
  SELECT 
      t.id AS templateId, 
      t.name AS templateName, 
      c.id AS columnId,
      c.name AS columnName,
      c.type AS columnType,
      cf.settingName AS settingName,
      cf.settingValue AS settingValue
  FROM Templates t
  LEFT JOIN TemplateColumns c ON t.id = c.templateId
  LEFT JOIN ColumnConfigs cf ON c.id = cf.columnId
`;

        const result = await this.executeQuery(query);

        // Process the results to group columns and settings under their respective templates
        const templatesMap: { [key: string]: any } = {};

        result.recordset.forEach(row => {
            if (!templatesMap[row.templateId]) {
                templatesMap[row.templateId] = {
                    id: row.templateId,
                    name: row.templateName,
                    columns: []
                };
            }

            if (row.columnId) {
                // Find or create column
                let column = templatesMap[row.templateId].columns.find(col => col.id === row.columnId);
                if (!column) {
                    column = {
                        id: row.columnId,
                        name: row.columnName,
                        type: row.columnType,
                        settings: []
                    };
                    templatesMap[row.templateId].columns.push(column);
                }

                // Add settings to the column
                if (row.settingName) {
                    column.settings.push({
                        name: row.settingName,
                        value: row.settingValue
                    });
                }
            }
        });

        // Return the processed templates data
        return Object.values(templatesMap);
    }

    async createBlankList(name: string): Promise<any> {
        if (!name) {
            throw new Error("List name cannot be empty");
        }
        const newId = uuidv4(); // Implement this function to generate unique IDs
        const result = await this.executeQuery('INSERT INTO Lists (id, name) VALUES (@id, @name)', [
            { name: 'id', type: sql.NVarChar, value: newId },
            { name: 'name', type: sql.NVarChar, value: name }
        ]);
        return result.recordset
    }

    async deleteList(listId: string): Promise<void> {
        await this.executeQuery('DELETE FROM Lists WHERE id = @id', [{ name: 'id', type: sql.NVarChar, value: listId }]);
    }


    async addColumn(listId: string, name: string, type: string, settings?: ColumnConfig[]
    ): Promise<any> {
        // Validate input parameters
        if (!name || !type) {
            throw new Error("Column name and type are required.");
        }

        // Convert column type from string to ColumnType enum
        const columnType = ColumnType[type as keyof typeof ColumnType];
        if (!columnType) {
            throw new Error(`Invalid column type: ${type}`);
        }

        // Check if the list exists
        const listResult = await this.executeQuery('SELECT * FROM Lists WHERE id = @id', [
            { name: 'id', type: sql.NVarChar, value: listId }
        ]);

        if (listResult.recordset.length === 0) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Check if a column with the same name already exists
        const columnExists = await this.executeQuery('SELECT * FROM Columns WHERE listId = @listId AND name = @name', [
            { name: 'listId', type: sql.NVarChar, value: listId },
            { name: 'name', type: sql.NVarChar, value: name }
        ]);

        if (columnExists.recordset.length > 0) {
            throw new Error(`A column with the name "${name}" already exists.`);
        }

        // Generate a new ID for the column
        const newColumnId = uuidv4();

        // Insert the new column into the database
        await this.executeQuery('INSERT INTO Columns (id, listId, name, type) VALUES (@id, @listId, @name, @type)', [
            { name: 'id', type: sql.NVarChar, value: newColumnId },
            { name: 'listId', type: sql.NVarChar, value: listId },
            { name: 'name', type: sql.NVarChar, value: name },
            { name: 'type', type: sql.NVarChar, value: columnType }
        ]);

        console.log(settings)

        // Insert column settings into the ColumnConfigs table if settings are provided
        if (settings && settings.length > 0) {
            for (const setting of settings) {
                const settingValue = Array.isArray(setting.settingValue)
                    ? setting.settingValue.join(',') // Convert array to comma-separated string
                    : setting.settingValue;
                await this.executeQuery('INSERT INTO ColumnConfigs (id, columnId, settingName, settingValue) VALUES (@id, @columnId, @settingName, @settingValue)', [
                    { name: 'id', type: sql.NVarChar, value: uuidv4() },
                    { name: 'columnId', type: sql.NVarChar, value: newColumnId },
                    { name: 'settingName', type: sql.NVarChar, value: setting.settingName },
                    { name: 'settingValue', type: sql.NVarChar, value: settingValue }
                ]);
            }
        }
        // Add the column to each row (assuming rows already exist in the list)
        const rowsResult = await this.executeQuery('SELECT id FROM Rows WHERE listId = @listId', [
            { name: 'listId', type: sql.NVarChar, value: listId }
        ]);

        for (const row of rowsResult.recordset) {
            await this.executeQuery('INSERT INTO RowData (id, rowId, columnId, value) VALUES (@id, @rowId, @columnId, @value)', [
                { name: 'id', type: sql.NVarChar, value: uuidv4() },
                { name: 'rowId', type: sql.NVarChar, value: row.id },
                { name: 'columnId', type: sql.NVarChar, value: newColumnId },
                { name: 'value', type: sql.NVarChar, value: null } // Initialize value to null
            ]);
        }

        return {
            id: newColumnId,
            listId: listId,
            name: name,
            type: columnType
        };
    }


    async deleteColumn(listId: string, columnId: string): Promise<void> {
        // Step 1: Remove the column from the Columns table
        await this.executeQuery('DELETE FROM Columns WHERE id = @id', [
            { name: 'id', type: sql.NVarChar, value: columnId }
        ]);

        // Step 2: Remove column data from each row
        await this.executeQuery('DELETE FROM RowData WHERE columnId = @columnId', [
            { name: 'columnId', type: sql.NVarChar, value: columnId }
        ]);
    }
    async addRow(listId: string, columnValues: { [key: string]: any }): Promise<any> {
        // Check if the list exists
        const listResult = await this.executeQuery('SELECT * FROM Lists WHERE id = @id', [
            { name: 'id', type: sql.NVarChar, value: listId }
        ]);

        if (listResult.recordset.length === 0) {
            throw new Error(`List with ID ${listId} not found.`);
        }

        // Generate a new ID for the row
        const newRowId = uuidv4();

        // Insert the new row into the Rows table
        await this.executeQuery('INSERT INTO Rows (id, listId) VALUES (@id, @listId)', [
            { name: 'id', type: sql.NVarChar, value: newRowId },
            { name: 'listId', type: sql.NVarChar, value: listId }
        ]);

        // Retrieve column IDs for the specified list
        const columnsResult = await this.executeQuery('SELECT id FROM Columns WHERE listId = @listId', [
            { name: 'listId', type: sql.NVarChar, value: listId }
        ]);

        // Insert data into RowData for each column
        for (const column of columnsResult.recordset) {
            const columnId = column.id;
            const value = columnValues[columnId] || null; // Use provided value or null if not provided

            await this.executeQuery('INSERT INTO RowData (id, rowId, columnId, value) VALUES (@id, @rowId, @columnId, @value)', [
                { name: 'id', type: sql.NVarChar, value: uuidv4() },
                { name: 'rowId', type: sql.NVarChar, value: newRowId },
                { name: 'columnId', type: sql.NVarChar, value: columnId },
                { name: 'value', type: sql.NVarChar, value: value }
            ]);
        }



        // Return the new row object
        return {
            id: newRowId,
            listId: listId,
            columnValues: columnValues
        };
    }

    async deleteRow(listId: string, rowId: string): Promise<void> {
        // Validate input
        if (!rowId) {
            throw new Error("Row ID is required.");
        }

        // Check if the row exists
        const rowResult = await this.executeQuery('SELECT * FROM Rows WHERE id = @id', [
            { name: 'id', type: sql.NVarChar, value: rowId }
        ]);

        if (rowResult.recordset.length === 0) {
            throw new Error(`Row with ID ${rowId} not found.`);
        }

        // Delete associated RowData entries
        await this.executeQuery('DELETE FROM RowData WHERE rowId = @rowId', [
            { name: 'rowId', type: sql.NVarChar, value: rowId }
        ]);

        // Delete the row
        await this.executeQuery('DELETE FROM Rows WHERE id = @id', [
            { name: 'id', type: sql.NVarChar, value: rowId }
        ]);
    }

    async getRows(
        listId: string,
        page: number,
        limit: number,
        search?: string,
        colName?: string,
        values?: any[]
    ): Promise<any> {
        if (!listId || page <= 0 || limit <= 0) {
            throw new Error("Valid list ID, page number, and limit are required.");
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Base query to fetch rows with pagination
        let rowsQuery = `
            SELECT id
            FROM Rows
            WHERE listId = @listId
        `;

        // Add search filter if provided
        if (search) {
            rowsQuery += ` AND EXISTS (
                SELECT 1 FROM RowData
                WHERE RowData.rowId = Rows.id
                AND RowData.value LIKE '%' + @search + '%'
            )`;
        }

        // Add column filter if provided
        if (colName && values) {
            rowsQuery += ` AND EXISTS (
                SELECT 1 FROM RowData
                WHERE RowData.rowId = Rows.id
                AND RowData.columnId = (SELECT id FROM Columns WHERE listId = @listId AND name = @colName)
                AND RowData.value IN (${values.map((_, i) => `@value${i}`).join(', ')})
            )`;
        }

        rowsQuery += `
            ORDER BY id
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;

        // Build parameters for rows query
        const params = [
            { name: 'listId', type: sql.NVarChar, value: listId },
            { name: 'offset', type: sql.Int, value: offset },
            { name: 'limit', type: sql.Int, value: limit }
        ];

        if (search) {
            params.push({ name: 'search', type: sql.NVarChar, value: search });
        }

        if (colName && values) {
            params.push({ name: 'colName', type: sql.NVarChar, value: colName });
            values.forEach((value, index) => {
                params.push({ name: `value${index}`, type: sql.NVarChar, value });
            });
        }

        // Execute the query to get row IDs
        const rowsResult = await this.executeQuery(rowsQuery, params);
        const rowIds = rowsResult.recordset.map((r: any) => r.id);

        // Fetch row data for the retrieved rows
        const dataQuery = `
            SELECT rd.rowId, rd.columnId, rd.value, c.name AS columnName,c.type AS columnType
            FROM RowData rd
            JOIN Columns c ON rd.columnId = c.id
            WHERE rd.rowId IN (${rowIds.map((_, i) => `@rowId${i}`).join(', ')})
        `;

        // Add parameters for row data query
        rowIds.forEach((id, index) => {
            params.push({ name: `rowId${index}`, type: sql.NVarChar, value: id });
        });

        const dataResult = await this.executeQuery(dataQuery, params);


        // Aggregate the data
        const rowsWithValues = dataResult.recordset.reduce((acc: any, row: any) => {
            if (!acc[row.rowId]) {
                acc[row.rowId] = { id: row.rowId, values: [] };
            }
            // Use the formatter based on column type
            const formatter = formatters[row.columnType] || formatters['default'];
            acc[row.rowId].values.push(formatter(row.value, row.columnName));
            return acc;
        }, {});

        // Convert the result into the desired format
        const formattedRows = Object.values(rowsWithValues);
        return {
            page,
            limit,
            rows: formattedRows
        };
    }


    async updateRowData(
        listId: string,
        rowId: string,
        columnId: string,
        newValue: any
    ): Promise<void> {

        // Convert the new value to string if it's not null
        const valueToUpdate = newValue !== null ? newValue.toString() : null;

        // Update the RowData
        await this.executeQuery(
            'UPDATE RowData SET value = @value WHERE rowId = @rowId AND columnId = @columnId',
            [
                { name: 'value', type: sql.NVarChar, value: valueToUpdate },
                { name: 'rowId', type: sql.NVarChar, value: rowId },
                { name: 'columnId', type: sql.NVarChar, value: columnId }
            ]
        );

        // Optionally, you could return a success message or updated data
    }
    async createListFromTemplate(templateId: string, listName: string): Promise<any> {
        // Step 1: Retrieve the template by ID
        const templateQuery = `
            SELECT 
                t.id AS templateId, 
                t.name AS templateName, 
                c.id AS columnId,
                c.name AS columnName,
                c.type AS columnType,
                cf.settingName AS settingName,
                cf.settingValue AS settingValue
            FROM Templates t
            LEFT JOIN TemplateColumns c ON t.id = c.templateId
            LEFT JOIN ColumnConfigs cf ON c.id = cf.columnId
            WHERE t.id = @templateId
        `;

        const templateResult = await this.executeQuery(templateQuery, [{ name: 'templateId', type: sql.NVarChar, value: templateId }]);
        const templateData = templateResult.recordset;

        if (templateData.length === 0) {
            throw new Error(`Template with ID ${templateId} not found.`);
        }

        // Step 2: Create a new list with the specified name
        const newListId = uuidv4(); // Assuming you're using the uuid library

        // Step 2b: Create a new list with the specified name and generated ID
        const newListQuery = `
            INSERT INTO Lists (id, name)
            VALUES (@id, @listName)
        `;

        await this.executeQuery(newListQuery, [
            { name: 'id', type: sql.sql.NVarChar, value: newListId },
            { name: 'listName', type: sql.NVarChar, value: listName }
        ]);


        // Step 3: Copy columns from the template to the new list
        const columns = templateData.filter(row => row.columnId);

        for (const column of columns) {
            const insertColumnQuery = `
                INSERT INTO Columns (id,listId, name, type)
                VALUES (@id,@listId, @name, @type)
            `;

            await this.executeQuery(insertColumnQuery, [
                { name: 'id', type: sql.NVarChar, value: uuidv4() },
                { name: 'listId', type: sql.NVarChar, value: newListId },
                { name: 'name', type: sql.NVarChar, value: column.columnName },
                { name: 'type', type: sql.NVarChar, value: column.columnType }
            ]);

            // Add column settings
            if (column.settingName) {
                const columnId = column.columnId; // Assuming you have a way to get the new columnId, or it’s available in the templateData
                const insertSettingQuery = `
                    INSERT INTO ColumnConfigs (columnId, settingName, settingValue)
                    VALUES (@columnId, @settingName, @settingValue)
                `;

                await this.executeQuery(insertSettingQuery, [
                    { name: 'columnId', type: sql.NVarChar, value: columnId },
                    { name: 'settingName', type: sql.NVarChar, value: column.settingName },
                    { name: 'settingValue', type: sql.NVarChar, value: column.settingValue }
                ]);
            }
        }

        return { id: newListId, name: listName };
    }

    async updateColumn(listId: string, columnId: string, name: string, type: string): Promise<any> {
        const updateColumnQuery = `
            UPDATE Columns
            SET name = @name, type = @type
            WHERE id = @columnId AND listId = @listId
        `;
        await this.executeQuery(updateColumnQuery, [
            { name: 'name', type: sql.NVarChar, value: name },
            { name: 'type', type: sql.NVarChar, value: type },
            { name: 'columnId', type: sql.NVarChar, value: columnId },
            { name: 'listId', type: sql.NVarChar, value: listId }
        ]);
        return { listId, columnId, name, type };
    }
}

export { MicrosoftListService };
