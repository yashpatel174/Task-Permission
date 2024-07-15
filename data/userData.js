const users = [
    {
        id: 1,
        name: 'admin',
        role: 'admin',
        permissions: ['manage_sub_users', 'crud'],
        subUsers: [2, 3]
    },
    {
        id: 2,
        name: 'userA',
        role: 'user',
        permissions: ['manage_sub_users', 'crud'],
        subUsers: [4, 5]
    },
    {
        id: 3,
        name: 'userB',
        role: 'user',
        permissions: ['manage_sub_users', 'crud'],
        subUsers: [6, 7]
    },
    {
        id: 4,
        name: 'subUserA',
        role: 'user',
        permissions: ['crud'],
        subUsers: []
    },
    {
        id: 5,
        name: 'subUserB',
        role: 'user',
        permissions: ['crud'],
        subUsers: []
    },
    {
        id: 6,
        name: 'subUserC',
        role: 'user',
        permissions: ['crud'],
        subUsers: []
    },
    {
        id: 7,
        name: 'subUserD',
        role: 'user',
        permissions: ['crud'],
        subUsers: []
    }
];

export default users;