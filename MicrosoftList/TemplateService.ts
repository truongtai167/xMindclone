import { Template } from "./Template";
import { Column, ColumnType, DateColumn, HyperlinkColumn, NumberColumn, TextColumn } from "./Column";

class TemplateService {
    static initializeDefaultTemplates(): Template[] {
        return [
            new Template("Project Template", [
                new TextColumn("Task"),
                new DateColumn("Due Date")
            ]),
            new Template("Contact List Template", [
                new TextColumn("Name"),
                new HyperlinkColumn("Email"),
                new TextColumn("Phone Number")
            ]),
            new Template("Inventory Template", [
                new TextColumn("Item"),
                new NumberColumn("Quantity"),
                new TextColumn("Price")
            ])
        ];
    }

}

export { TemplateService };
