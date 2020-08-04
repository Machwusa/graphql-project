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
    {id:'1', title: 'Reading', description: 'I like books', userID: '1'},
    {id:'2', title: 'Surfing internet', description: 'I like websites', userID: '13'},
    {id:'3', title: 'Swimming', description: 'I like water', userID: '211'},
    {id:'4', title: 'Football', description: 'I like kicking ball', userID: '19'},
    {id:'5', title: 'Painting', description: 'I like making pictures from a blank canvas', userID: '150'},
]

let postData = [
    {id:'11', comment: 'Books are awesome', userID: '1'},
    {id:'22', comment: 'Visited reddit for the first time in years', userID: '1'},
    {id:'33', comment: 'I saw a shark in the ocean', userID: '19'},
    {id:'44', comment: 'Cant believe we let Chelsea win', userID: '211'},
    {id:'55', comment: 'Art is an explosion', userID: '1'},
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
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
        profession: {type: GraphQLString},

        posts:{
            type: GraphQLList(PostType),
            resolve(parent, args){
                return _.filter(postData, {userID: parent.id})
            }
        },

        hobbies:{
            type: GraphQLList(HobbyType),
            resolve(parent, args){
                return _.filter(hobbiesData, {userID: parent.id})
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(userData, {id: parent.userID})
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(userData, {id: parent.userID})
            }
        }
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
