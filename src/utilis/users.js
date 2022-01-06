const users = []

// addUsers, removeUsers. getusers. getusersbyroom
const addUser = ({id, username, room}) => {
    //  Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room){
        return{
            error :'username and room is required!'
        }
    }

    // existing users
    const ExistingUsers = users.find((user) => {
        return  user.room === room && user.username === username
    })
       
    // validate users
    if(ExistingUsers){
        return{
            error: 'Username is in use'
        }
    }

    // store the users
    const user = { id, username, room }
    users.push(user)
    return{ user }
}

const removeUsers = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUsers = (id) => {
    const alluser = users.find((user) => {
        return user.id === id
    })

    if(alluser){
        return alluser
    }
}

const getUserinroom = (room) => {
    const data = users.filter((user) => {
        return user.room === room 
    })

    if(data){
        return data
    }
}

module.exports = {
    addUser,
    removeUsers,
    getUsers,
    getUserinroom
}