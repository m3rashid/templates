# nodejs-rest

Boilerplate setup for nodejs REST API backend

To set up locally

1. Fork/Clone the repository
2. Install the dependencies with &nbsp; `yarn`, &nbsp; If you don't have yarn installed on your system, run &nbsp; `sudo npm i -g yarn` &nbsp; to install it.
3. Install nvm (if you dont have already) and also install the node version used in the project
4. run `nvm use` to use the node version of the project (it would be for each terminal session separately), or else you can set that node version as default from nvm
5. Run the file `./utils/generateKeyPair.js` with node to create your public private key pair
6. Use the &nbsp; `package.json` &nbsp; to get to know about scripts to run and codebase structure

<br>

## Key Takeaways

```
Completely in typescript

1. Authentication workflow setup  [PENDING]
2. JWT Authorization (access + refresh token)  [PENDING]
4. Image upload workflow  [PENDING]
5. Caching with Redis  [PENDING]

6. Rate Limiting  [DONE]
7. Built in Logging support  [DONE]
8. Prisma for database things  [DONE]
```
