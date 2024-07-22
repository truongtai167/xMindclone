import { Row } from "./Row";

interface IList {
    addRow(columnValues: { [columnId: string]: any }): Row;
    // Add other methods if needed
}
export { IList }