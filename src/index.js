import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import pg from 'pg';
import typeDefs from './typeDefs.js';

dotenv.config();
const { Pool } = pg;

const connectionString = process.env.PG_CONNECTION_STRING;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

const resolvers = {
    Query: {
        restaurants: async () => {
            const result = await pool.query('SELECT * FROM restaurants');

            return result.rows.map(row => ({
            id: row.id,
            RestaurantName: row.RestaurantName,  
            StreetAddress: row.StreetAddress,  
            cuisine: row.cuisine,               
            latitude: row.latitude,             
            longitude: row.longitude            
            }));
        },
        restaurant: async (_, args) => {
          const result = await pool.query('SELECT * FROM public.get_restaurant_by_name($1)', [args.name]);
          console.log(result);
          if (result.rows.length === 0) return null;
          const row = result.rows[0];
          return {
            id: row.id,
            RestaurantName: row.restaurant_name,  
            StreetAddress: row.streetaddress,  
            cuisine: row.cuisine,               
            latitude: null,             
            longitude:null           
          };
        },
        restaurantreviews: async () => {
            const result = await pool.query(`select r.id, r."RestaurantID", r."ReviewText", TO_CHAR(r."ReviewDate", 'MM/DD/YYYY') as "ReviewDate", r."Rating" from restaurantreviews r`);
            return result.rows.map(row => ({
                id: row.id,
                RestaurantID: row.RestaurantID,  
                UserID: row.UserID,  
                ReviewText: row.ReviewText,               
                ReviewDate: row.ReviewDate,         
                Rating: row.Rating            
                }));
        },
    }
}
      


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4040 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
