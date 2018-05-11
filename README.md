# amicabot

This app reads Amica lunch menu provided by JSON interface, contructs a post based on the data and sends the data to Slack web hook.

# Prerequisite
Change value for *-env.yml > SLACKWEBHOOK regarding your created incoming webhook value

# To run
To run this: 
* DEV: sls deploy
* PROD: sls deploy -s prod

# Useful to read
* http://www.serverless.com
* Axios: https://www.npmjs.com/package/axios
* lodash: https://lodash.com/
* Slack incoming webhooks: https://api.slack.com/incoming-webhooks