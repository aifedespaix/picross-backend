import {compare, hash} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import {booleanArg, idArg, mutationType, stringArg} from 'nexus';
import {APP_SECRET, getUserId, verifyMap, verifySetAdminPassword} from '../utils';

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: stringArg({nullable: false}),
        password: stringArg({nullable: false}),
      },
      resolve: async (_parent, {name, email, password}, ctx) => {
        const hashedPassword = await hash(password, 10);
        const user = await ctx.photon.users.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return {
          token: sign({userId: user.id}, APP_SECRET),
          user,
        };
      },
    });

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({nullable: false}),
        password: stringArg({nullable: false}),
      },
      resolve: async (_parent, {email, password}, context) => {
        const user = await context.photon.users.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }
        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
          throw new Error('Invalid password');
        }
        return {
          token: sign({userId: user.id}, APP_SECRET),
          user,
        };
      },
    });

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg({nullable: false}),
        content: stringArg(),
      },
      resolve: (parent, {title, content}, ctx) => {
        const userId = getUserId(ctx);
        return ctx.photon.posts.create({
          data: {
            title,
            content,
            published: false,
            author: {connect: {id: userId}},
          },
        });
      },
    });

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: {id: idArg()},
      resolve: (parent, {id}, ctx) => {
        return ctx.photon.posts.delete({
          where: {
            id,
          },
        });
      },
    });

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: {id: idArg()},
      resolve: (parent, {id}, ctx) => {
        return ctx.photon.posts.update({
          where: {id},
          data: {published: true},
        });
      },
    });

    t.field('createPicross', {
      type: 'Picross',
      args: {
        title: stringArg({nullable: false}),
        map: stringArg({nullable: false}),
      },
      resolve: (parent, {title, map}, ctx) => {
        verifyMap(map);
        const userId = getUserId(ctx);
        return ctx.photon.picrosses.create({
          data: {
            title,
            map,
            author: {connect: {id: userId}},
          },
        });
      },
    });

    t.field('likePicross', {
      type: 'Picross',
      args: {
        id: idArg(),
        like: booleanArg({nullable: false}),
      },
      resolve: async (parent, {like, id}, ctx) => {
        const target = await ctx.photon.picrosses.findOne({
          where: {id},
        });
        /** todo
         * Code de merde car on vérifie même pas qui vote,
         * donc on peut masse dislike mdr
         */
        return ctx.photon.picrosses.update({
          where: {id},
          data: {likes: like ? target.likes+1 : target.likes-1},
        });
      },
    });

    t.field('validatePicross', {
      type: 'Picross',
      args: {
        id: idArg(),
        valid: booleanArg({nullable: false}),
      },
      resolve: async (parent, {valid, id}, ctx) => {
        return ctx.photon.picrosses.update({
          where: {id},
          data: {validated: valid},
        });
      },
    });

    t.field('setAdmin', {
      type: 'User',
      args: {
        id: stringArg(({nullable: true})),
        password: stringArg(({nullable: false})),
      },
      resolve: async (parent, {password, id}, ctx) => {
        verifySetAdminPassword(password);
        const targetId = id ? id : getUserId(ctx);
        return ctx.photon.users.update({
          where: {id: targetId},
          data: {level: 'ADMIN'},
        });
      },
    });
  },
});
