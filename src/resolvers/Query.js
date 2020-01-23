const Query = {
    me(parent, args, { db }, info) {
        return db.users[0];
    },
    post(parent, args, { db }, info) {
        return db.posts[0];
    },
    users(parent, args, { db }, info) {
        if (args.query) {
            // return  users.filter(user => user.name === args.query);
            return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
        } else {
            return db.users;
        }
    },
    posts(parent, args, { db }, info) {
        if (args.query) {
            return db.posts.filter(post => {
                const titleSearch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const bodySearch = post.body.toLowerCase().includes(args.query.toLowerCase());

                return titleSearch || bodySearch;
            });
        } else {
            return db.posts;
        }
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
};

export default Query;