const graphql = require('graphql')
let _ = require('lodash')

let userData = [
    {id: '1', name: 'Bond', age: 36, profession: 'Spy'},
    {id: '13', name: 'Anna', age: 26, profession: 'Physician'},
    {id: '211', name: 'Bella', age: 16, profession: 'Artist'},
    {id: '19', name: 'Gina', age: 27, profession: 'Teacher'},
    {id: '150', name: 'George', age: 35, profession: 'Developer'}
]

let hobbiesData = [
    {id:'1', title: 'Reading', description: 'I like books'},
    {id:'2', title: 'Surfing internet', description: 'I like websites'},
    {id:'3', title: 'Swimming', description: 'I like water'},
    {id:'4', title: 'Football', description: 'I like kicking ball'},
    {id:'5', title: 'Painting', description: 'I like making pictures from a blank canvas'},
]

let postData = [
    {id:'11', comment: 'Books are awesome'},
    {id:'22', comment: 'Visited reddit for the first time in years'},
    {id:'33', comment: 'I saw a shark in the ocean'},
    {id:'44', comment: 'Cant believe we let Chelsea win'},
    {id:'55', comment: 'Art is an explosion'},
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql

//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString}
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString}
    })
})


//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id:{type: GraphQLString}},

            resolve(parent, args){
               return _.find(userData, {id: args.id})
                //resolve with data
                //get and return data from a datasource
            }
        },

        hobby:{
            type: HobbyType,
            args: {id:{type: GraphQLID}},

            resolve(parent, args){
               //return data for hobby
                return _.find(hobbiesData, {id: args.id})
            }
        },

        post:{
            type: PostType,
            args: {id:{type: GraphQLID}},

            resolve(parent, args){
                //return data for hobby
                return _.find(postData, {id: args.id})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
