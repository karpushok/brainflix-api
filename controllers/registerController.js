const fsPromises = require('fs').promises
const path = require('path')
const uuid = require('uuid')

const userDB = {
  users: require('../data/registration.json'),
  setRegistration(user) {
    this.users = user
  }
}

const handleNewRegistration = (req, res) => {
  try {
    const newUUID = uuid.v4()
    
    userDB.setRegistration([...userDB.users, newUUID])

    //write to DB
    fsPromises.writeFile(path.join(__dirname, '..', 'data', 'registration.json'), JSON.stringify(userDB.users))

    res.status(201).json({api_key: newUUID})

  } catch (error) {
    res.status(500).json({'message': error.message})
  }

}

module.exports = {handleNewRegistration}