# Social-Network-POC

A small social network for dog lovers. Just a quick POC of an API with Express and NodeJs

## Requirements

- Required use of NodeJs and Express
- ORM use for MYSQL is not allowed
- Async flows need to be done in promises or async/await
- The API must respond and receive data in JSON format
- Before every request a log mus be printed with some information about the process running
- Error handling is required
- Good organization and clean code with a design pattern where the logic and the data model are independant

### Special Conditions

- When a user registers, the user introduces username, e-mail and password in a form.
- The form also stores location info (lat and long) and the browser language.
- The users relates to each other by a "friendship relation", generating a list of friends.
- The users in north hemisphere are saved in our database while the south hemisphere are stored in a third party API system.

#### Starting Code

```
const isSouthOrNorth = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (latitude >= 0 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
                resolve('N');
            } else if (latitude < 0 && latitude >= -90 && longitude >= -180 && longitude <= 180){
                resolve('S');
            } else {
                reject(new Error('Bad values'));
            }
        }, 700);
    });
};

const processSouthern = (data) => { 
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve();
        }, 1000); 
    });
};
```

## Objectives

- Design and develop a REST API that has the CRUD for the user entity
- Design a query to return the friends list for a specified user and another for a friends count for a specified user.

### Asumptions

- To have a friend you must first ask for it and then the other user need to accept you (in database a column named status controls this)


#### Installation

Just install the node modules and then launch the server

```
npm install
node server.js
```

You need to create a mysql schema, you can use the script located in utils/createDatabase.js
It also has an option to populate the tables with fake data.

You can view the API documentation in https://valkiriann.github.io/Social-Network-POC/
