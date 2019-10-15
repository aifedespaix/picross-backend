"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
var utils_1 = require("../utils");
exports.Query = nexus_1.queryType({
    definition: function (t) {
        t.field('me', {
            type: 'User',
            resolve: function (parent, args, ctx) {
                var userId = utils_1.getUserId(ctx);
                return ctx.photon.users.findOne({
                    where: {
                        id: userId
                    }
                });
            }
        });
        t.list.field('feed', {
            type: 'Post',
            resolve: function (parent, args, ctx) {
                return ctx.photon.posts.findMany({
                    where: { published: true }
                });
            }
        });
        t.list.field('filterPosts', {
            type: 'Post',
            args: {
                searchString: nexus_1.stringArg({ nullable: true })
            },
            resolve: function (parent, _a, ctx) {
                var searchString = _a.searchString;
                return ctx.photon.posts.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: searchString
                                }
                            },
                            {
                                content: {
                                    contains: searchString
                                }
                            },
                        ]
                    }
                });
            }
        });
        t.field('post', {
            type: 'Post',
            nullable: true,
            args: { id: nexus_1.idArg() },
            resolve: function (parent, _a, ctx) {
                var id = _a.id;
                return ctx.photon.posts.findOne({
                    where: {
                        id: id
                    }
                });
            }
        });
    }
});
//# sourceMappingURL=Query.js.map