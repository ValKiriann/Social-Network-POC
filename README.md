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

## Objectives

- Design and develop a REST API that has the CRUD for the user entity
- Design a query to return the friends list for a specified user and another for a friends count for a specified user.
