import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, { input }, { db }, info) {
        const { email } = input;
        const emailTaken = db.users.some(user => user.email === email);
        if (emailTaken) throw new Error('Email taken.');

        const user = {
            id: uuidv4(),
            ...input
        }
        
        db.users.push(user);

        return user;
    },
    updateUser(parent, { id, input }, { db }, info) {
        const user = db.users.find(user => user.id === id);
        if (!user) throw new Error('User not found');

        const { name, email, age } = input;

        if (typeof email === 'string') {
            const emailTaken = db.users.some(user => user.email === email); 
            if (emailTaken) throw new Error('Email taken.');

            user.email = email;
        } 

        if (typeof name === 'string') {
            user.name = name;
        }
        
        if (typeof age === 'number') {
            user.age = age;
        }

        return user;
    },
    deleteUser(parent, { id }, { db }, info) {
        const userIdx = db.users.findIndex(user => user.id === id);
        if (userIdx === -1) throw new Error('User not found');

        const deletedUser = db.users.splice(userIdx, 1);

        db.posts = db.posts.filter(post => {
            const match = post.author === id;

            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id);
            }

            return !match;
        });

        db.comments = db.comments.filter(comment => comment.author !== id);

        return deletedUser[0];
    },
    async createPost(parent, { input }, { db, pubsub }, info) {
        const { author } = input;
        const userExists = db.users.some(user => user.id === author);
        if (!userExists) throw new Error('User not found');

        const post = {
            id: uuidv4(),
            ...input
        }
        
        db.posts.push(post);

        if (post.published) {
            await pubsub.publish({
                topic: `post`,
                payload: {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    },
                    db
                }
            });
        }

        return post;
    },
    async updatePost(parent, { id, input }, { db, pubsub }, info) {
        const post = db.posts.find(post => post.id === id);
        const originalPost = { ...post };
        if (!post) throw new Error('Post not found');

        const { title, body, published } = input;

        if (typeof title === 'string') {
            post.title = title;
        } 

        if (typeof body === 'string') {
            post.body = body;
        }
        
        if (typeof published === 'boolean') {
            post.published = published;
            
            if (originalPost.published && !post.published) {
                await pubsub.publish({
                    topic: `post`,
                    payload: {
                        post: {
                            mutation: 'DELETED',
                            data: originalPost
                        },
                        db
                    }
                });
            } else if (!originalPost.published && post.published) {
                await pubsub.publish({
                    topic: `post`,
                    payload: {
                        post: {
                            mutation: 'CREATED',
                            data: post
                        },
                        db
                    }
                });
            }
        } else if (post.published) {
            await pubsub.publish({
                topic: `post`,
                payload: {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    },
                    db
                }
            });
        }

        return post;
    },
    async deletePost(parent, { id }, { db, pubsub }, info) {
        const postIdx = db.posts.findIndex(post => post.id === id);
        if (postIdx === -1) {
            throw new Error('Post not found');
        }

        const [deletedPost] = db.posts.splice(postIdx, 1);

        db.comments = db.comments.filter(comment => comment.post !== id);

        if (deletedPost.published) {
            await pubsub.publish({
                topic: `post`,
                payload: {
                    post: {
                        mutation: 'DELETED',
                        data: deletedPost
                    },
                    db
                }
            });
        }

        return deletedPost;
    },
    async createComment(parent, { input }, { db, pubsub }, info) {
        const { post, author } = input;
        const userExists = db.users.some(user => user.id === author);
        const postExists = db.posts.some(singlePost => singlePost.id === post && singlePost.published);
        if (!userExists || !postExists) throw new Error('User/Post not found');

        const comment = {
            id: uuidv4(),
            ...input
        }
        
        db.comments.push(comment);

        await pubsub.publish({
            topic: `comment ${ post }`,
            payload: {
                comment: {
                    mutation: 'CREATED',
                    data: comment
                },
                db
            }
        });

        return comment;
    },
    async updateComment(parent, { id, input }, { db, pubsub }, info) {
        const comment = db.comments.find(comment => comment.id === id);
        if (!comment) throw new Error('Comment not found');

        const { text } = input;

        if (typeof text === 'string') {
            comment.text = text;
        }

        await pubsub.publish({
            topic: `comment ${ comment.post }`,
            payload: {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                },
                db
            }
        });

        return comment;
    },
    async deleteComment(parent, { id }, { db, pubsub }, info) {
        const commentIdx = db.comments.findIndex(comment => comment.id === id);
        if (commentIdx === -1) {
            throw new Error('Comment not found');
        }

        const [deletedComment] = db.comments.splice(commentIdx, 1);

        await pubsub.publish({
            topic: `comment ${ deletedComment.post }`,
            payload: {
                comment: {
                    mutation: 'DELETED',
                    data: deletedComment
                },
                db
            }
        });

        return deletedComment;
    }
}

export default Mutation;