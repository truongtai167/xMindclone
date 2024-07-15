import { defaultConfig } from "../config"
import _ from 'lodash'


interface IExporter {
    export(sheet: Sheet): string
}

class XMind {
    public sheets: Sheet[];

    constructor(sheets: Sheet[] = [new Sheet()]) {
        this.sheets = sheets;
    }

    addSheet() {
        const sheets = new Sheet()
        this.sheets.push(sheets);
    }

    removeSheet(sheet: Sheet) {
        this.sheets = this.sheets.filter(s => s !== sheet);
    }

    duplicateSheet(sheet: Sheet): Sheet {
        const duplicatedSheet = _.cloneDeep(sheet);
        duplicatedSheet.name = `${sheet.name} - Copy`;
        // const duplicatedSheet = new Sheet(
        // _.cloneDeep(sheet.rootNode),
        // _.cloneDeep(sheet.floatingTopics),
        // _.cloneDeep(sheet.rels),
        // `${sheet.name} - Copy`
        // );
        this.sheets.push(duplicatedSheet);
        return duplicatedSheet;
    }

    exportSheet(sheet: Sheet, exporter: IExporter) {
        return exporter.export(sheet)
    }
}

class Sheet {
    public rootNode: Topic;
    public floatingTopics: Topic[];
    public rels: Relationship[];
    public name: string

    constructor(rootNode: Topic = NodeFactory.createDefaultRootNode(), floatingTopics: Topic[] = [],
        rels: Relationship[] = [], name: string = 'Mind Map') {
        this.rootNode = rootNode;
        this.floatingTopics = floatingTopics;
        this.rels = rels;
        this.name = name
    }

    addFloatingNode() {
        const floatingNode = new Topic(
            new Position(),
            new Shape(),
            new Color(defaultConfig.floatingNode.color.name),
            new Text(defaultConfig.floatingNode.text.size,
                defaultConfig.floatingNode.text.style, defaultConfig.floatingNode.text.content)
        );
        this.floatingTopics.push(floatingNode);
    }

    removeFloatingNode(node: Topic) {
        this.floatingTopics = this.floatingTopics.filter(n => n !== node);
    }
    renameSheet(name: string) {
        this.name = name
    }

    addRelationship(fromNode: Topic, toNode: Topic) {
        const relationship = new Relationship(fromNode, toNode);
        this.rels.push(relationship);
    }
    removeRelationship(fromNode: Topic, toNode: Topic) {
        this.rels = this.rels.filter(rel => !(rel.fromNode === fromNode && rel.toNode === toNode));
    }

}

class Topic {
    public child: Topic[];
    public color: Color;
    public shape: Shape;
    public position: Position;
    public text: Text;
    public parentNode: Topic | null;
    constructor(
        position: Position = new Position(),
        shape: Shape = new Shape(),
        color: Color = new Color(),
        text: Text = new Text(),
        parentNode: Topic | null = null
    ) {
        this.child = [];
        this.position = position;
        this.shape = shape;
        this.color = color;
        this.text = text;
        this.parentNode = parentNode;
    }

    addChild(node: Topic) {
        node.parentNode = this
        this.child.push(node);
    }

    removeChild(node: Topic) {
        this.child = this.child.filter(n => n !== node);
        node.parentNode = null;
    }

    changeText(text: string) {
        this.text.changeText(text);
    }

    changeColor(color: string) {
        this.color.changeColor(color);
    }

    changeShape(name: string) {
        this.shape.changeShape(name);
    }

    changeTextSize(size: number) {
        this.text.changeTextSize(size);
    }
    changeParentNode(newParent: Topic | null) {
        // Remove from current parent's child list, if exists
        this.parentNode?.removeChild(this);

        // Set new parent
        this.parentNode = newParent;

        // Add to new parent's child list, if new parent exists
        newParent?.addChild(this);
    }

    duplicate(): Topic {
        const duplicateNode = _.cloneDeep(this)
        this.parentNode?.addChild(duplicateNode)
        return duplicateNode
    }
}

class Relationship {
    public fromNode: Topic
    public toNode: Topic
    public color: Color
    public text: Text

    constructor(fromNode: Topic, toNode: Topic, color: Color = new Color(),
        text: Text = new Text(defaultConfig.relationship.text.size,
            defaultConfig.relationship.text.style, defaultConfig.relationship.text.content)) {
        this.fromNode = fromNode
        this.toNode = toNode
        this.color = color
        this.text = text
    }
    changeText(text: string) {
        this.text.changeText(text);
    }
    changeTextSize(size: number) {
        this.text.changeTextSize(size);
    }
    changeColor(color: string) {
        this.color.changeColor(color);
    }


}

class Position {
    public x: number
    public y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
}
class Shape {
    public name: string
    public fill: boolean
    public border: boolean

    constructor(name: string = 'Rectangle', fill: boolean = false, border: boolean = false) {
        this.name = name
        this.fill = fill
        this.border = border
    }
    changeShape(name: string) {
        this.name = name
    }
}
class Color {
    public name: string

    constructor(name: string = 'Black') {
        this.name = name
    }

    changeColor(newColor: string) {
        this.name = newColor
    }
}

class Text {
    public content: string
    public size: number
    public style: string

    constructor(size: number = 13, style: string = 'Arial', content: string = 'Content') {
        this.content = content
        this.size = size
        this.style = style
    }
    changeText(text: string) {
        this.content = text
    }
    changeTextSize(size: number) {
        this.size = size
    }

}

class NodeFactory {
    static createDefaultRootNode(): Topic {
        const rootNode = new Topic(
            new Position(),
            new Shape(),
            new Color(defaultConfig.rootNode.color.name),
            new Text(defaultConfig.rootNode.text.size,
                defaultConfig.rootNode.text.style,
                defaultConfig.rootNode.text.content)
        );
        defaultConfig.mainTopics.forEach(topic => {
            rootNode.addChild(new Topic(
                new Position(),
                new Shape(),
                new Color(topic.color),
                new Text(topic.size, topic.style, topic.content)
            ));
        });
        return rootNode;
    }
}

class PNGExporter implements IExporter {
    export(sheet: Sheet): string {
        return `${sheet.name}.png`
    }
}

class PDFExporter implements IExporter {
    export(sheet: Sheet): string {
        return `${sheet.name}.pdf`
    }
}








export { Topic, Relationship, Position, Shape, Color, Text, Sheet, XMind, PNGExporter, PDFExporter }
