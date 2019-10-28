import {objectType} from 'nexus';

export const Picross = objectType({
  name: 'Picross',
  definition(t) {
    t.model.id();
    t.model.map();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.validated();
    t.model.title();
    t.model.likes();
    t.model.author();
  },
});
