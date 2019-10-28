import {rule, shield} from 'graphql-shield';
import {getUserId} from '../utils';

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),
  isPostOwner: rule()(async (parent, {id}, context) => {
    const userId = getUserId(context);
    const author = await context.photon.posts
      .findOne({
        where: {
          id,
        },
      })
      .author();
    return userId === author.id;
  }),
  isAdmin: rule()(async (parent, {id}, context) => {
    const userId = getUserId(context);
    const user = await context.photon.users.findOne({where: {id: userId}});
    return user.level === 'ADMIN';
  }),
};

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    filterPosts: rules.isAuthenticatedUser,
    post: rules.isAuthenticatedUser,
    users: rules.isAdmin,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    createPicross: rules.isAuthenticatedUser,
    likePicross: rules.isAuthenticatedUser,
    setAdmin: rules.isAuthenticatedUser,
    validatePicross: rules.isAdmin,
    deletePost: rules.isPostOwner,
    publish: rules.isPostOwner,
  },
});
