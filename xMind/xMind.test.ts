import { Nodee, Sheet, XMind, PNGExporter, PDFExporter } from "./xMind"

describe("xMind test", () => {
    let xMind: XMind
    beforeEach(() => {
        xMind = new XMind()
    })
    test('mind map should have 1 sheet when create default', () => {
        expect(xMind.sheets.length).toBe(1)
    })

    test('1 sheet should have 1 rootNode and 4 child when create default', () => {
        expect(xMind.sheets[0].rootNode.child.length).toBe(4)
    })
    test('add new sheet to the mindmap', () => {
        const newsheet = new Sheet()
        xMind.addSheet(newsheet)
        expect(xMind.sheets).toContain(newsheet)
    })
    test('remove sheet from the mindmap', () => {
        const newsheet = new Sheet()
        xMind.addSheet(newsheet)
        xMind.removeSheet(newsheet)
        expect(xMind.sheets).not.toContain(newsheet)
    })

    test('should duplicated sheet', () => {
        xMind.duplicateSheet(xMind.sheets[0])
        expect(xMind.sheets.length).toBe(2)
        expect(xMind.sheets[1].name).toBe('Mind Map - Copy')
    })

    test('add floating node to the sheet', () => {
        xMind.sheets[0].addFloatingNode();
        expect(xMind.sheets[0].floatingNode.length).toBe(1);
    });

    test('delete floating node from the sheet', () => {
        xMind.sheets[0].addFloatingNode();
        xMind.sheets[0].removeFloatingNode(xMind.sheets[0].floatingNode[0])
        expect(xMind.sheets[0].floatingNode.length).toBe(0);
    });

    test('rename sheet', () => {
        xMind.sheets[0].renameSheet('Sheet 1');;
        expect(xMind.sheets[0].name).toBe('Sheet 1');
    });

    test('duplicated node', () => {
        const duplicate = xMind.sheets[0].rootNode.child[0].duplicate()
        expect(xMind.sheets[0].rootNode.child).toContain(duplicate);
        expect(duplicate.parentNode).toBe(xMind.sheets[0].rootNode);
    });


    test('add child to a rootNode', () => {
        const nodechild1 = new Nodee()
        xMind.sheets[0].rootNode.addChild(nodechild1);
        expect(xMind.sheets[0].rootNode.child).toContain(nodechild1);
    });
    test('remove child from a rootNode', () => {

        xMind.sheets[0].rootNode.removeChild(xMind.sheets[0].rootNode.child[0]);
        expect(xMind.sheets[0].rootNode.child.length).toBe(3)
    });

    test('change text content of rootNode', () => {
        xMind.sheets[0].rootNode.changeText('xMind');
        expect(xMind.sheets[0].rootNode.text.content).toBe('xMind')
    })
    test('change color of rootNode', () => {
        xMind.sheets[0].rootNode.changeColor('red');
        expect(xMind.sheets[0].rootNode.color.name).toBe('red')
    })
    test('change shape of rootNode', () => {
        xMind.sheets[0].rootNode.changeShape('Triangle');
        expect(xMind.sheets[0].rootNode.shape.name).toBe('Triangle')
    })
    test('change text size of rootNode', () => {
        xMind.sheets[0].rootNode.changeTextSize(20)
        expect(xMind.sheets[0].rootNode.text.size).toBe(20)
    })
    test('should have relationship', () => {
        xMind.sheets[0].addRelationship(xMind.sheets[0].rootNode.child[0], xMind.sheets[0].rootNode)
        expect(xMind.sheets[0].relationship.length).toBe(1)
        expect(xMind.sheets[0].relationship[0].text.content).toBe('Relationship')
    })
    test('should remove relationship', () => {
        xMind.sheets[0].addRelationship(xMind.sheets[0].rootNode.child[0], xMind.sheets[0].rootNode)
        xMind.sheets[0].removeRelationship(xMind.sheets[0].rootNode.child[0], xMind.sheets[0].rootNode)
        expect(xMind.sheets[0].relationship.length).toBe(0)
    })

    test('change relationship text', () => {
        xMind.sheets[0].addRelationship(xMind.sheets[0].rootNode.child[0], xMind.sheets[0].rootNode)
        xMind.sheets[0].relationship[0].changeText('abc')
        expect(xMind.sheets[0].relationship[0].text.content).toBe('abc')
    })
    test('change relationship textsize', () => {
        xMind.sheets[0].addRelationship(xMind.sheets[0].rootNode.child[0], xMind.sheets[0].rootNode)
        xMind.sheets[0].relationship[0].changeTextSize(30)
        expect(xMind.sheets[0].relationship[0].text.size).toBe(30)
    })
    test('should change parent node and new parent node should update child', () => {
        const nodechau = new Nodee()
        xMind.sheets[0].rootNode.child[0].addChild(nodechau)
        nodechau.changeParentNode(xMind.sheets[0].rootNode)
        expect(nodechau.parentNode).toBe(xMind.sheets[0].rootNode)
        expect(xMind.sheets[0].rootNode.child).toContain(nodechau)
        expect(xMind.sheets[0].rootNode.child.length).toBe(5)

    })
    test('should export sheet to PNG', () => {
        const result = xMind.exportSheet(xMind.sheets[0], new PNGExporter())
        expect(result).toBe(`${xMind.sheets[0].name}.png`)
    })
    test('should export sheet to PDF', () => {
        const result = xMind.exportSheet(xMind.sheets[0], new PDFExporter())
        expect(result).toBe(`${xMind.sheets[0].name}.png`)
    })
})
