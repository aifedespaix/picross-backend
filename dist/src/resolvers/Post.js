"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
exports.Post = nexus_1.objectType({
    name: 'Post',
    definition: function (t) {
        t.model.id();
        // t.model.createdAt()
        // t.model.updatedAt()
        t.model.published();
        t.model.title();
        t.model.content();
        t.model.author();
    }
});
//# sourceMappingURL=Post.js.map