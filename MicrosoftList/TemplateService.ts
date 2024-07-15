import { Template } from "./Template";
import { Column, ColumnType } from "./Column";

class TemplateService {
    static initializeDefaultTemplates(): Template[] {
        return [
            new Template("Project Template", [
                new Column("Task", ColumnType.Text),
                new Column("Due Date", ColumnType.Date)
            ]),
            new Template("Contact List Template", [
                new Column("Name", ColumnType.Text),
                new Column("Email", ColumnType.Hyperlink),
                new Column("Phone Number", ColumnType.Text)
            ]),
            new Template("Inventory Template", [
                new Column("Item", ColumnType.Text),
                new Column("Quantity", ColumnType.Number),
                new Column("Price", ColumnType.Text)
            ])
        ];
    }

}

export { TemplateService };
