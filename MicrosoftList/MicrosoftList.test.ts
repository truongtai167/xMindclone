import { MicrosoftList } from "./MicrosoftList"
import { DateColumn, ImageColumn, NumberColumn, TextColumn, YesNoColumn } from "./Column"
import { ViewType } from "./View"

describe("xMind test", () => {
    let mcslist: MicrosoftList

    beforeEach(() => {
        mcslist = new MicrosoftList()
    })

    test('add row and column', () => {
        const list = mcslist.createBlankList('List1')
        const col1 = list.addColumn(new TextColumn('Name'))
        const col2 = list.addColumn(new DateColumn('Date Of Birth'))
        const col3 = list.addColumn(new YesNoColumn('Married'))
        const col4 = list.addColumn(new NumberColumn('Age'))
        const row1 = list.addRow({
            [col1.id]: 'Truong Tai',
            [col2.id]: '2024-07-08',
            [col3.id]: true,
            [col4.id]: 22,
        });
        const row2 = list.addRow({
            [col1.id]: 'Tai Truong',
            [col2.id]: '2024-07-08',
            [col3.id]: false,
            [col4.id]: 30,
        });
        const row3 = list.addRow({
            [col1.id]: 'Khoi Nguyen',
            [col2.id]: '2024-07-08',
            [col3.id]: false,
            [col4.id]: 30,
        });
        expect(list.rows.length).toBe(3)
        expect(row1.columns[0].value).toBe('Truong Tai')
        expect(row2.columns[0].value).toBe('Tai Truong')
        expect(col1.value).toBe(null)

        const col5 = list.addColumn(new ImageColumn('Image'))
        expect(row1.columns.length).toBe(5)


        list.setItemColumnValue(row1.id, row1.columns[4].id, 'image/link')
        expect(row1.columns[4].value).toBe('image/link')
        expect(row2.columns[4].value).toBe(null)
        expect(row3.columns[4].value).toBe(null)


        list.removeColumn('Image')
        expect(row1.columns.length).toBe(4)
        expect(row2.columns.length).toBe(4)
        expect(row3.columns.length).toBe(4)



        const searchResult = list.searchRow('Tai')
        expect(searchResult.length).toBe(2)




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
        const list = mcslist.createBlankList('List1')
        list.addColumn(new DateColumn('Date'))
        expect(list.columns.length).toBe(1)
        list.addRow()
        expect(list.rows[0].columns.length).toBe(1)
    })
    test('remove a column in a list', () => {
        const list = mcslist.createBlankList('List1')
        list.addRow()
        list.addColumn(new DateColumn('Date'))
        expect(list.columns.length).toBe(1)
        list.removeColumn('Date')
        expect(list.columns.length).toBe(0)
        expect(list.rows[0].columns.length).toBe(0)
    })

    test('add a item in a list', () => {
        const list = mcslist.createBlankList('List1')
        list.addRow()
        expect(list.rows.length).toBe(1)
        list.addColumn(new DateColumn('Date'))
        expect(list.rows[0].columns.length).toBe(1)
        expect(list.columns.length).toBe(1)

    })
    test('delete a item in a list', () => {
        const list = mcslist.createBlankList('List1')
        list.addRow()
        expect(list.rows.length).toBe(1)
        list.deleteRow(list.rows[0].id)
        expect(list.rows.length).toBe(0)
    })
    test('microsoft list add a item in a list', () => {
        const list = mcslist.createBlankList('List1')
        list.addRow()
        list.addRow()
        expect(list.rows.length).toBe(2)
        list.addColumn(new TextColumn('Text'))
        list.addColumn(new DateColumn('Date'))
        list.addColumn(new YesNoColumn('YesNo'))
        list.addColumn(new NumberColumn('Number'))
        expect(list.columns.length).toBe(4)
        expect(list.rows[0].columns.length).toBe(4)
        expect(list.rows[1].columns.length).toBe(4)
    })

    test('add value for item', () => {
        const list = mcslist.createBlankList('List1')
        list.addColumn(new TextColumn('Text'))
        list.addColumn(new DateColumn('Date'))
        list.addRow()
        list.setItemColumnValue(list.rows[0].id, list.rows[0].columns[0].id, 'Abc')
        list.setItemColumnValue(list.rows[0].id, list.rows[0].columns[1].id, '2024-07-16')
        expect(list.rows[0].columns[0].value).toBe('Abc')
        expect(list.columns[0].value).toBe(null)
    })
    test('add a view', () => {
        const list = mcslist.createBlankList('List1')
        expect(list.views.length).toBe(1)
        list.createView('Board View', ViewType.Board)
        expect(list.views.length).toBe(2)
        expect(list.columns).toEqual(list.views[0].columns)
        expect(list.columns).toEqual(list.views[1].columns)
        expect(list.rows).toEqual(list.views[0].items)
        expect(list.rows).toEqual(list.views[1].items)
    })




})