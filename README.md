## How to generally deploy containers to gcloud (great free tier)

https://cloud.google.com/run/docs/quickstarts/build-and-deploy#node.js

## How to set environment variables

https://cloud.google.com/run/docs/configuring/environment-variables

https://cloud.google.com/run/docs/configuring/environment-variables#command-line

## Where to set env variables or manage ram/cpu options

https://console.cloud.google.com/run/detail/us-west1/helloworld/revisions?project=scrapymcscrapeface

## Manage env variables from the command line

```
gcloud run deploy scrapymcscrapeface --image gcr.io/[PROJECT-ID]/[IMAGE] --update-env-vars KEY1=VALUE1,KEY2=VALUE2

gcloud run services update scrapymcscrapeface --update-env-vars TWILIO_ACCOUNT_SID=xxxxxxx,TWILIO_AUTO_TOKEN=xxxxxxx
```

## Docker image with puppeteer included

https://github.com/buildkite/docker-puppeteer

## Deployment steps

`gcloud builds submit --tag gcr.io/scrapymcscrapeface/helloworld`

`gcloud run deploy --image gcr.io/scrapymcscrapeface/helloworld --platform managed`
