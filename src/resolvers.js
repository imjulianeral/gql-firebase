const resolvers = {
    Query: {
        me() {
            return {
                id: '68743516541',
                name: 'Jorge',
                email: 'george@email.com',
                age: 21
            }
        },
        post() {
            return {
                id: '6887651684',
                title: 'How to use Fastify with GraphQL-jit',
                body: 'loremslihdgjdsfgnihsdbfghbdsfgbhsbfdoasbdfbskgbsdfbgh',
                published: true
            }
        }
    }
};

export default resolvers;