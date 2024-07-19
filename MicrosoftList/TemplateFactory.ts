import { Template } from "./Template";
import { DateColumn, HyperlinkColumn, NumberColumn, TextColumn, createColumn, ColumnType } from "./Column";
import fs from 'fs'

class TemplateFactory {

    static initializeDefaultTemplates(): Template[] {

        const columnTypeMapping: Record<string, ColumnType> = {
            "TextColumn": ColumnType.Text,
            "DateColumn": ColumnType.Date,
            "HyperlinkColumn": ColumnType.Hyperlink,
            "NumberColumn": ColumnType.Number,
        };
        const filePath = './MicrosoftList/template.json';
        const templatesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return templatesData.map((templateData: any) => {
            const columns = templateData.columns.map((colData: any) => {
                const columnTypeString = colData.type;
                const columnType = columnTypeMapping[columnTypeString];
                return createColumn(colData.name, columnType);
            });

            return new Template(templateData.name, columns);
        });
    }

}

export { TemplateFactory };
