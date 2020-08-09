const graphql = require('graphql')
let _ = require('lodash')
const User = require('../model/User');
const Hobby = require('../model/Hobby');
const Post = require('../model/Post');

let userData = [
    {id: '1', name: 'Bond', age: 36, profession: 'Spy'},
    {id: '13', name: 'Anna', age: 26, profession: 'Physician'},
    {id: '211', name: 'Bella', age: 16, profession: 'Artist'},
    {id: '19', name: 'Gina', age: 27, profession: 'Teacher'},
    {id: '150', name: 'George', age: 35, profession: 'Developer'}
]

let hobbiesData = [
    {id: '1', title: 'Reading', description: 'I like books', userID: '1'},
    {id: '2', title: 'Surfing internet', description: 'I like websites', userID: '13'},
    {id: '3', title: 'Swimming', description: 'I like water', userID: '211'},
    {id: '4', title: 'Football', description: 'I like kicking ball', userID: '19'},
    {id: '5', title: 'Painting', description: 'I like making pictures from a blank canvas', userID: '150'},
]

let postData = [
    {id: '11', comment: 'Books are awesome', userID: '1'},
    {id: '22', comment: 'Visited reddit for the first time in years', userID: '1'},
    {id: '33', comment: 'I saw a shark in the ocean', userID: '19'},
    {id: '44', comment: 'Cant believe we let Chelsea win', userID: '211'},
    {id: '55', comment: 'Art is an explosion', userID: '1'},
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
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

        posts: {
            type: GraphQLList(PostType),
            resolve(parent, args) {
                return _.filter(postData, {userID: parent.id})
            }
        },

        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
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
            resolve(parent, args) {
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
            resolve(parent, args) {
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
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                return _.find(userData, {id: args.id})
                //resolve with data
                //get and return data from a datasource
            }
        },

        users: {
            type: GraphQLList(UserType),

            resolve(parent, args) {
                return userData;
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                //return data for hobby
                return _.find(hobbiesData, {id: args.id})
            }
        },

        hobbies: {
            type: GraphQLList(HobbyType),

            resolve(parent, args) {
                return hobbiesData;
            }
        },

        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                //return data for hobby
                return _.find(postData, {id: args.id})
            }
        },

        posts: {
            type: GraphQLList(PostType),

            resolve(parent, args) {
                return postData;
            }
        },
    }
})

//Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Create user Mutation
        CreateUser: {
            type: UserType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },

            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })

                return user.save()
            }
        },

        //Update user
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },

            resolve(parent, args) {

                let updatedUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {
                        new: true,
                        useFindAndModify: true
                    } //send back the updated objectType
                )

                return updatedUser

            }
        },

        //Remove user mutation
        RemoveUser: {
            type: UserType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },

            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(
                    args.id,
                    {
                        useFindAndModify: true
                    }
                ).exec()
                if (!removedUser){
                    throw "Error"
                }

                return removedUser
            }
        },

        //Create post Mutation
        CreatePost: {
            type: PostType,
            args: {
                comment: {type: GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLNonNull(GraphQLString)}
            },

            resolve(parent, args) {
                let post = Post({
                    comment: args.comment,
                    userId: args.userId

                });

                return post.save();


            }
        },
        //Update post
        UpdatePost: {
            type: PostType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                comment: {type: GraphQLNonNull(GraphQLString)},
            },

            resolve(parent, args) {

                let updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {
                        new: true,
                        useFindAndModify: true
                    } //send back the updated objectType
                )

                return updatedPost

            }
        },

        //Remove post mutation
        RemovePost: {
            type: PostType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },

            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(
                    args.id,
                    {
                        useFindAndModify: true
                    }
                ).exec()

                if (!removedPost){
                    throw "Error"
                }

                return removedPost
            }
        },

        //Create hobby Mutation
        CreateHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });

                return hobby.save();

            }
        },

        //Update hobby
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                title: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)}
            },

            resolve(parent, args) {

                let updatedHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {
                        new: true,
                        useFindAndModify: true
                    } //send back the updated objectType
                )

                return updatedHobby

            }
        },

        //Remove hobby mutation
        RemoveHobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },

            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id,
                    {
                        useFindAndModify: true
                    }
                ).exec()

                if (!removedHobby){
                    throw "Error"
                }

                return removedHobby
            }
        },

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
