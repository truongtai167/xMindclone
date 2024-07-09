// config.ts

export const defaultConfig = {
    rootNode: {
        position: { x: 0, y: 0 },
        color: { name: 'Black' },
        text: { size: 20, style: 'Arial', content: 'Central Topic' }
    },
    mainTopics: [
        { color: 'Blue', size: 16, style: 'Arial', content: 'Main Topic 1' },
        { color: 'Red', size: 16, style: 'Arial', content: 'Main Topic 2' },
        { color: 'Yellow', size: 16, style: 'Arial', content: 'Main Topic 3' },
        { color: 'Green', size: 16, style: 'Arial', content: 'Main Topic 4' }
    ],
    floatingNode: {
        position: { x: 0, y: 0 },
        color: { name: 'Gray' },
        text: { size: 13, style: 'Arial', content: 'Floating Topic' }
    },
    relationship: {
        text: { size: 13, style: 'Arial', content: 'Relationship' }
    }
};
