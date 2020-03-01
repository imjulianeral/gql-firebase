const User = {
  async children(parent, args, { db }, info) {
    const father = await db.collection('users').doc(parent.id)

    const userChildren = await db
      .collection('children')
      .where('parent', '==', father)
      .get()

    return userChildren.docs.map(child => Object.assign(child.data(), { id: child.id }))
  }
}

export default User
