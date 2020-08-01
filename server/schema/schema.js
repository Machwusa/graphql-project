const graphql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
} = graphql

//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Docs for user',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})
