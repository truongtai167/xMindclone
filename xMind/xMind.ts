import { defaultConfig } from "../config"

interface INode {
    addChild(node: INode): void
    removeChild(node: INode): void
    changeParentNode(newParent: Nodee | null): void
    duplicate(): Nodee
}
interface IText {
    changeText(text: string): void
    changeTextSize(size: number): void
}

interface IShape {
    changeShape(name: string): void
}

interface IColor {
    changeColor(color: string): void
}
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
        const duplicatedSheet = new Sheet(
            sheet.rootNode,
            sheet.floatingNode,
            sheet.relationship,
            `${sheet.name} - Copy`,);
        this.sheets.push(duplicatedSheet);
        return duplicatedSheet;
    }
    exportSheet(sheet: Sheet, exporter: IExporter) {
        return exporter.export(sheet)
    }
}

class Sheet {
    public rootNode: Nodee;
    public floatingNode: Nodee[];
    public relationship: Relationship[];
    public name: string
    // public theme: Theme

    constructor(rootNode: Nodee = NodeFactory.createDefaultRootNode(), otherNode: Nodee[] = [], relationship: Relationship[] = [], name: string = 'Mind Map') {
        this.rootNode = rootNode;
        this.floatingNode = otherNode;
        this.relationship = relationship;
        this.name = name
        // this.theme = theme
    }

    addFloatingNode() {
        const floatingNode = new Nodee(
            new Position(),
            new Shape(),
            new Color(defaultConfig.floatingNode.color.name),
            new Text(defaultConfig.floatingNode.text.size, defaultConfig.floatingNode.text.style, defaultConfig.floatingNode.text.content)
        );
        this.floatingNode.push(floatingNode);
    }

    removeFloatingNode(node: Nodee) {
        this.floatingNode = this.floatingNode.filter(n => n !== node);
    }
    renameSheet(name: string) {
        this.name = name
    }

    addRelationship(fromNode: Nodee, toNode: Nodee) {
        const relationship = new Relationship(fromNode, toNode);
        this.relationship.push(relationship);
    }
    removeRelationship(fromNode: Nodee, toNode: Nodee) {
        this.relationship = this.relationship.filter(rel => !(rel.fromNode === fromNode && rel.toNode === toNode));
    }

    // applyThemeToNode(node: Nodee) {
    //     this.theme.applyTheme(node);
    //     node.child.forEach(childNode => {
    //         this.applyThemeToNode(childNode);
    //     });
    // }
    // applyThemeToMap() {
    //     this.applyThemeToNode(this.rootNode);
    // }
}

class Nodee implements INode, IText, IColor, IShape {
    public child: Nodee[];
    public color: Color;
    public shape: Shape;
    public position: Position;
    public text: Text;
    public parentNode: Nodee | null;
    constructor(
        position: Position = new Position(),
        shape: Shape = new Shape(),
        color: Color = new Color(),
        text: Text = new Text(),
        parentNode: Nodee | null = null
    ) {
        this.child = [];
        this.position = position;
        this.shape = shape;
        this.color = color;
        this.text = text;
        this.parentNode = parentNode;
    }

    addChild(node: Nodee) {
        node.parentNode = this
        this.child.push(node);
    }

    removeChild(node: Nodee) {
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
    changeParentNode(newParent: Nodee | null) {
        // Remove from current parent's child list, if exists
        this.parentNode?.removeChild(this);

        // Set new parent
        this.parentNode = newParent;

        // Add to new parent's child list, if new parent exists
        newParent?.addChild(this);
    }

    duplicate(): Nodee {
        const duplicateNode = new Nodee(
            new Position(this.position.x, this.position.y),
            new Shape(this.shape.name),
            new Color(this.color.name),
            new Text(this.text.size, this.text.style, this.text.content),
            this.parentNode
        );
        this.child.forEach(childNode => {
            const duplicatedChild = childNode.duplicate();
            duplicateNode.addChild(duplicatedChild)
        });
        this.parentNode?.addChild(duplicateNode)
        return duplicateNode
    }
}

class Relationship implements IText, IColor {
    public fromNode: Nodee
    public toNode: Nodee
    public color: Color
    public text: Text

    constructor(fromNode: Nodee, toNode: Nodee, color: Color = new Color(), text: Text = new Text(defaultConfig.relationship.text.size, defaultConfig.relationship.text.style, defaultConfig.relationship.text.content)) {
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
class Shape implements IShape {
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
class Color implements IColor {
    public name: string

    constructor(name: string = 'Black') {
        this.name = name
    }

    changeColor(newColor: string) {
        this.name = newColor
    }
}

class Text implements IText {
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
    static createDefaultRootNode(): Nodee {
        const rootNode = new Nodee(
            new Position(),
            new Shape(),
            new Color(defaultConfig.rootNode.color.name),
            new Text(defaultConfig.rootNode.text.size,
                defaultConfig.rootNode.text.style,
                defaultConfig.rootNode.text.content)
        );
        defaultConfig.mainTopics.forEach(topic => {
            rootNode.addChild(new Nodee(
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

// class Theme {
//     public color: Color
//     public shape: Shape
//     public text: Text


//     constructor(color: Color, shape: Shape, text: Text) {
//         this.color = color
//         this.shape = shape
//         this.text = text
//     }

//     applyTheme(node: INode) {
//         if (node.changeColor) {
//             node.changeColor(this.color.name);
//         }
//         if (node.changeShape) {
//             node.changeShape(this.shape.name);
//         }
//         if (node.changeText) {
//             node.changeText(this.text.content);
//         }
//     }
// }


export { Nodee, Relationship, Position, Shape, Color, Text, Sheet, XMind, PNGExporter, PDFExporter }
