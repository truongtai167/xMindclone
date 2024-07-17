import { MicrosoftList } from "./MicrosoftList"
import { DateColumn, NumberColumn, TextColumn, YesNoColumn } from "./Column"
import { ViewType } from "./View"

describe("xMind test", () => {
    let mcslist: MicrosoftList

    beforeEach(() => {
        mcslist = new MicrosoftList()
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

    test('add a column in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addColumn(new DateColumn('Date'))
        expect(mcslist.lists[0].columns.length).toBe(1)
        mcslist.lists[0].addRow()
        expect(mcslist.lists[0].items[0].columns.length).toBe(1)
    })
    test('remove a column in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addRow()
        mcslist.lists[0].addColumn(new DateColumn('Date'))
        expect(mcslist.lists[0].columns.length).toBe(1)
        mcslist.lists[0].removeColumn('Date')
        expect(mcslist.lists[0].columns.length).toBe(0)
        expect(mcslist.lists[0].items[0].columns.length).toBe(0)
    })

    test('add a item in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addRow()
        expect(mcslist.lists[0].items.length).toBe(1)
        mcslist.lists[0].addColumn(new DateColumn('Date'))
        expect(mcslist.lists[0].items[0].columns.length).toBe(1)
        expect(mcslist.lists[0].columns.length).toBe(1)

    })
    test('delete a item in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addRow()
        expect(mcslist.lists[0].items.length).toBe(1)
        mcslist.lists[0].deleteRow(mcslist.lists[0].items[0].id)
        expect(mcslist.lists[0].items.length).toBe(0)
    })
    test('microsoft list add a item in a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addRow()
        mcslist.lists[0].addRow()
        expect(mcslist.lists[0].items.length).toBe(2)
        mcslist.lists[0].addColumn(new TextColumn('Text'))
        mcslist.lists[0].addColumn(new DateColumn('Date'))
        mcslist.lists[0].addColumn(new YesNoColumn('YesNo'))
        mcslist.lists[0].addColumn(new NumberColumn('Number'))
        expect(mcslist.lists[0].columns.length).toBe(4)
        expect(mcslist.lists[0].items[0].columns.length).toBe(4)
        expect(mcslist.lists[0].items[1].columns.length).toBe(4)
    })

    test('add value for item', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].addColumn(new TextColumn('Text'))
        mcslist.lists[0].addColumn(new DateColumn('Date'))
        mcslist.lists[0].addRow()
        mcslist.lists[0].setItemColumnValue(mcslist.lists[0].items[0].id, mcslist.lists[0].items[0].columns[0].id, 'Abc')
        mcslist.lists[0].setItemColumnValue(mcslist.lists[0].items[0].id, mcslist.lists[0].items[0].columns[1].id, '2024-07-16')
        expect(mcslist.lists[0].items[0].columns[0].value).toBe('Abc')
        expect(mcslist.lists[0].columns[0].value).toBe(null)
    })
    test('add a view', () => {
        mcslist.createBlankList('List1')
        expect(mcslist.lists[0].views.length).toBe(1)
        mcslist.lists[0].createView('Board View', ViewType.Board)
        expect(mcslist.lists[0].views.length).toBe(2)
        expect(mcslist.lists[0].columns).toEqual(mcslist.lists[0].views[0].columns)
        expect(mcslist.lists[0].columns).toEqual(mcslist.lists[0].views[1].columns)
        expect(mcslist.lists[0].items).toEqual(mcslist.lists[0].views[0].items)
        expect(mcslist.lists[0].items).toEqual(mcslist.lists[0].views[1].items)
    })
    test('add a list to favorite', () => {
        mcslist.createBlankList('List1')
        mcslist.addFavoriteList(mcslist.lists[0].id)
        expect(mcslist.favoriteLists.length).toBe(1)
    })
    test('remove a list from favorite', () => {
        mcslist.createBlankList('List1')
        mcslist.addFavoriteList(mcslist.lists[0].id)
        mcslist.removeFavoriteList(mcslist.lists[0].id)
        expect(mcslist.favoriteLists.length).toBe(0)
    })
    test('change name of a list', () => {
        mcslist.createBlankList('List1')
        mcslist.lists[0].changeName('Abc')
        expect(mcslist.lists[0].name).toBe('Abc')
    })

})