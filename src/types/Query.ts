import {booleanArg, idArg, queryType, stringArg} from 'nexus';
import {getUserId} from '../utils';

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.photon.users.findOne({
          where: {
            id: userId,
          },
        });
      },
    });

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.photon.users.findMany();
      },
    });

    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.photon.posts.findMany({
          where: {published: true},
        });
      },
    });

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({nullable: true}),
      },
      resolve: (parent, {searchString}, ctx) => {
        return ctx.photon.posts.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        });
      },
    });

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: {id: idArg()},
      resolve: (parent, {id}, ctx) => {
        return ctx.photon.posts.findOne({
          where: {
            id,
          },
        });
      },
    });

    t.field('picross', {
      type: 'Picross',
      nullable: true,
      args: {
        id: idArg(),
      },
      resolve: async (parent, {id}, ctx) => {
        if (!id) { // Random Picross
          const nbPicrosses = Number(await ctx.photon.picrosses.count());
          const picrosses = await ctx.photon.picrosses.findMany({
            skip: Math.floor(Math.random() * nbPicrosses),
            first: 1
          });
          return picrosses[0];
        } else {
          return ctx.photon.picrosses.findOne({
            where: {id},
          });
        }
      },
    });

    t.list.field('picrosses', {
      type: 'Picross',
      nullable: true,
      args: {
        searchString: stringArg({nullable: true}),
        validated: booleanArg(),
      },
      resolve: (parent, {searchString, validated}, ctx) => {
        return ctx.photon.picrosses.findMany({
          where: {
            AND: [
              {title: {contains: searchString}},
              validated ? {validated} : {},
            ],
          },
        });
      },
    });
  },
});
