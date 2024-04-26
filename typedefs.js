const typeDefs = `#graphql
  scalar JSON

  input User {
    email:String!
    first_name:String!
    last_name:String!
    user_name:String!
    security_question:String!
    security_answer:String!
    fcm_token:String
  }

  input Session {
    session_name:String!
    description:String!
  }

  input message {
    from:String!
    fcm_token:String!
    messageValue:String!
  }
  
  type Query {
    getUser(id:Int):JSON
    getAllUsers(page:Int):JSON

    getSession:(id:Int!):JSON
    getAllSessions(page:Int!):JSON
  }

  type Mutation{
    registerUser(user:User):JSON
    updateUser(user:JSON, id:Int!):JSON
    deleteUser(id:Int!):JSON

    createSession(session:Session):JSON
    updateSession(session:JSON, id:Int!):JSON
    deleteSession(id:Int!):JSON

    sendMessage(message:message):JSON
  }
`;
module.exports = typeDefs