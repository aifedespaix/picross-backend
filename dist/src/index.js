"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var nexus_prisma_1 = require("nexus-prisma");
var photon_1 = require("@generated/photon");
var nexus_1 = require("nexus");
var graphql_yoga_1 = require("graphql-yoga");
var path_1 = require("path");
var permissions_1 = require("./permissions");
var allTypes = require("./resolvers");
var photon = new photon_1.Photon();
var nexusPrismaTypes = nexus_prisma_1.nexusPrismaPlugin({
    types: allTypes
});
var schema = nexus_1.makeSchema({
    types: [allTypes, nexusPrismaTypes],
    outputs: {
        schema: path_1.join(__dirname, '/schema.graphql')
    },
    typegenAutoConfig: {
        sources: [
            {
                source: '@generated/photon',
                alias: 'photon'
            },
            {
                source: path_1.join(__dirname, 'types.ts'),
                alias: 'ctx'
            },
        ],
        contextType: 'ctx.Context'
    }
});
var server = new graphql_yoga_1.GraphQLServer({
    schema: schema,
    middlewares: [permissions_1.permissions],
    context: function (request) {
        return __assign(__assign({}, request), { photon: photon });
    }
});
server.start(function () { return console.log("\uD83D\uDE80 Server ready at: http://localhost:4000\n\u2B50\uFE0F See sample queries: http://pris.ly/e/ts/graphql-auth#5-using-the-graphql-api"); });
//# sourceMappingURL=index.js.map