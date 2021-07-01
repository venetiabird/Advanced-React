import { list } from '@keystone-next/keystone/schema';
import { text, password } from '@keystone-next/fields';

// named export -> makes auto imports easier
export const User = list({
  // access:
  // ui:
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    // todo: add roles cart and orders
  },
});
