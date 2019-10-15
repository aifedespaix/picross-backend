import {objectType} from 'nexus';

export const Picross = objectType({
  name: 'Picross',
  definition(t: any) {
    t.model.id();
    t.model.map();
  },
});
