const users = [
    { id: '2316545', name: 'Jorge', email: 'jorge@email.com', age: 21 },
    { id: '8465589', name: 'Derek', email: 'derek@email.com', age: 18 },
    { id: '3219878', name: 'Diana', email: 'diana@email.com', age: 19 }
];
const posts = [
    { id: '2316545', title: 'Classic Novels', body: 'lorem ipsum', published: true, author: '2316545' },
    { id: '8435165', title: 'GQL', body: 'Fastify & GQL-jit', published: true, author: '2316545' },
    { id: '8465589', title: 'Art of War', body: 'WW3', published: false, author: '8465589' },
    { id: '3219878', title: 'Steve Job\'s Biography', body: 'Something', published: true, author: '3219878' }
];
const comments = [
    { id: '1', text: 'lorem ipsum', author: '2316545', post: '2316545' },
    { id: '2', text: 'its awesome', author: '8465589', post: '8435165' },
    { id: '3', text: 'I would try', author: '3219878', post: '8465589' },
    { id: '4', text: 'bad post', author: '2316545', post: '3219878' }
];

const db = {
    users,
    comments,
    posts
}

export default db;