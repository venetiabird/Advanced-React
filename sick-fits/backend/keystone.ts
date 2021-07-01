import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { createAuth } from '@keystone-next/auth';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // length of time they are signed in
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    //todo add in inital roles
  }
})


export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // todo add data seeding here
    async onConnect(keystone) {
      console.log('connecting to the db')
      if(process.argv.includes('--seed-data'))
      await insertSeedData(keystone)
    },
  },
  lists: createSchema({
    // schema items go here
    User,
    Product,
    ProductImage,
  }),
  ui: {
      // show the ui for those that pass this test
    isAccessAllowed: ({session}) => {
      // console.log(session)
      return !!session?.data
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    // Graphql query
    User: `id name email`,
  }),
}));
