import {idArg, queryType, stringArg} from 'nexus';
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

    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.photon.posts.findMany({
          where: {published: true},
        });
      },
    });

    t.field('picross', {
      type: 'Picross',
      nullable: true,
      args: {
        id: idArg({required: false}),
      },
      resolve: async (parent, {id}, ctx) => {
        if(id) {
          return ctx.photon.picrosses.findOne({
            where: {id},
          });
        } else {
          const picrosses = await ctx.photon.picrosses.findMany();
          const random = Math.round(Math.random()) * picrosses.length;
          return picrosses[random] as any;
        }
      },
    });

    t.list.field('picrosses', {
      type: 'Picross',
      nullable: true,
      resolve: async (parent, args, ctx) => {
        return ctx.photon.picrosses.findMany();
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
  },
});
