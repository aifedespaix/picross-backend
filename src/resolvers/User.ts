import {objectType} from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t: any) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.posts({pagination: false});
  },
});
