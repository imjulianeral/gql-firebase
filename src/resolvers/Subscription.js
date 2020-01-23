const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish({ 
                    topic: 'count', 
                    payload: { count }
                });
            }, 1000);

            return pubsub.subscribe('count');
        }
    },
    comment: {
        resolve({ comment, db }, { postID }, ctx, info) {
            // Manipulate and return the new value
            ctx.db = db;
            return comment;
        },
        async subscribe(parent, { postID }, { pubsub }, info) {
            return await pubsub.subscribe(`comment ${ postID }`);
        }
    },
    post: {
        resolve({ post, db }, args, ctx, info) {
            // Manipulate and return the new value
            ctx.db = db;
            return post;
        },
        async subscribe(parent, args, { pubsub }, info) {
            return await pubsub.subscribe(`post`);
        }
    }
}

export default Subscription;