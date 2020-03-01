const Child = {
  async parent(parent, args, { db }, info) {
    const children = await db.collection('children').doc(parent.id)

    const userParent = await db
      .collection('users')
      .where('children', 'array-contains', children)
      .get()

    return userParent.docs.map(user => Object.assign(user.data(), { id: user.id }))[0]
  }
}

export default Child
