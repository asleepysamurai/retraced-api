# To run

1. Clone repo and cd into it
2. `yarn install`
3. `yarn run typeorm migration:run`
4. `yarn start`

# For tests

`yarn test`

This project is forked off of my standard ts api server scaffold project, so there might be a few unneeded files I've failed to cleanup.

I have chosen to use an SQLITE db for easy portability. Once you run the migration, it will create the db in `./data` directory.

The code is mostly self explanatory. It's a pretty standard fastify api server setup. No complicated logic anywhere. We can discuss this further in the next call :)
