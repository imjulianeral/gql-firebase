const Query = {
  async users(parent, args, { db }, info) {
    if (args.query) {
      // return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
      const users = await db
        .collection('users')
        .where('email', '==', args.query)
        .get()

      return users.docs.map(user => user.data())
    } else {
      const users = await db.collection('users').get()

      return users.docs.map(user =>
        Object.assign(user.data(), {
          id: user.id,
          createdAt: user.data().createdAt._seconds
        })
      )
    }
  },
  async singleUser(parent, args, { db }, info) {
    const user = await db.doc(`users/${args.id}`).get()

    return Object.assign(user.data(), { id: user.id }) || new Error('ID not found')
  },
  async children(parent, args, { db }, info) {
    const children = await db.collection(`children`).get()

    return children.docs.map(child => Object.assign(child.data(), { id: child.id }))
  }
  // posts(parent, args, { db }, info) {
  //     if (args.query) {
  //         return db.posts.filter(post => {
  //             const titleSearch = post.title.toLowerCase().includes(args.query.toLowerCase());
  //             const bodySearch = post.body.toLowerCase().includes(args.query.toLowerCase());

  //             return titleSearch || bodySearch;
  //         });
  //     } else {
  //         return db.posts;
  //     }
  // }
}

export default Query
