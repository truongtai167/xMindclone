import { List } from "./List"
import { Item } from "./Item"
import { MicrosoftList } from "./MicrosoftList"
import { Column, ColumnType } from "./Column"
import { TemplateService } from "./TemplateService"

describe("xMind test", () => {
    let mcslist: MicrosoftList

    beforeEach(() => {
        mcslist = new MicrosoftList()
    })

    test('microsoft list should have default template', () => {
        expect(mcslist.templates.length).toBe(3)
    })
    test('microsoft list should create new blank list', () => {
        mcslist.createBlankList('List1')
        expect(mcslist.lists.length).toBe(1)
        expect(mcslist.lists[0].columns).toEqual([])

    })
    test('microsoft list should delete list', () => {
        mcslist.createBlankList('List1')
        mcslist.deleteList(mcslist.lists[0].id)
        expect(mcslist.lists.length).toBe(0)
    })
    test('microsoft list add a template list', () => {
        mcslist.addTemplateList(mcslist.templates[0].id, 'Management');
        expect(mcslist.lists.length).toBe(1)
        expect(mcslist.lists[0].columns).toEqual(mcslist.templates[0].columns)
    })

    test('microsoft list add a column in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addItem()
        mcslist.lists[0].addColumn('Day', ColumnType.Date)
        expect(mcslist.lists[0].columns.length).toBe(1)
        expect(mcslist.lists[0].columns).toEqual(mcslist.lists[0].items[0].columns)
    })
    test('microsoft list remove a column in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addItem()
        mcslist.lists[0].addColumn('Day', ColumnType.Date)
        expect(mcslist.lists[0].columns.length).toBe(1)
        mcslist.lists[0].removeColumn(mcslist.lists[0].columns[0].id)
        expect(mcslist.lists[0].columns.length).toBe(0)
        expect(mcslist.lists[0].items[0].columns.length).toBe(0)
    })

    test('microsoft list add a item in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addItem()
        expect(mcslist.lists[0].items.length).toBe(1)
        mcslist.lists[0].addColumn('Day', ColumnType.Date)
        expect(mcslist.lists[0].items[0].columns.length).toBe(1)
        expect(mcslist.lists[0].columns).toEqual(mcslist.lists[0].items[0].columns)
    })

})