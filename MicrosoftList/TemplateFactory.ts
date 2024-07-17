import { Template } from "./Template";
import { DateColumn, HyperlinkColumn, NumberColumn, TextColumn } from "./Column";

class TemplateFactory {
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

export { TemplateFactory };