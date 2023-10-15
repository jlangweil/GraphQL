const typeDefs = `
type Restaurant {
  id: ID!
  RestaurantName: String
  StreetAddress: String
  cuisine: String
  latitude: Float
  longitude: Float
}

type RestaurantReview {
  id: ID!
  RestaurantID: ID!
  UserID: ID!
  ReviewText: String!
  ReviewDate: String
  Rating: Int
}

type Query {
  restaurants: [Restaurant!]
  restaurant(name: String): Restaurant
  restaurantreviews: [RestaurantReview!]
}

type Mutation {
  addRestaurant(restaurant: RestaurantInput): Restaurant
  addReview(review: ReviewInput): RestaurantReview
}

input RestaurantInput {
  RestaurantName: String!
  StreetAddress: String!
  cuisine: String!
  latitude: Float
  longitude: Float
}

input ReviewInput {
  RestaurantID: ID!
  UserID: ID!
  ReviewText: String!
  ReviewDate: String
  Rating: Int!
}
`;

export default typeDefs;