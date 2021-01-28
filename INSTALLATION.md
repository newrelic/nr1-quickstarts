# Installation

## Requirements (in order)

* Git: [Install instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* NodeJS: [Install instructions](https://nodejs.dev/learn/how-to-install-nodejs)
* NR1 CLI: [Install instructions](https://one.newrelic.com/launcher/developer-center.launcher?pane=eyJuZXJkbGV0SWQiOiJkZXZlbG9wZXItY2VudGVyLmRldmVsb3Blci1jZW50ZXIifQ==)

## Set-up

1) Download the lastest version of the Nerdpack with Git

Depending on your operating system you can do this through a Git GUI or the Git CLI. The Git CLI command is shown below:

`git clone git@github.com:newrelic/quickstarts.git`

2) Download dependencies

Now that we have the latest version of the sourcecode we need to download the latest dependencies. You can do that by running the following command in your command line. This command needs to be run in the `quickstart` directory. You know when you're in the right directory when you see the `INSTALLATION.md` file.

`npm install`

3) Publish the Nerdlet to your New Relic account

If you succesfully completed all the steps you will be able to publish the Nerdlet into your New Relic account. Run the command below in the commandline.

`nr1 nerdpack:publish --channel=STABLE`

If that command succeed you can then deploy the Nerdlet.

`nr1 nerdpack:deploy --channel=STABLE`

You should now see the Quickstarts nerdlet if you go to `Apps` in New Relic One. Follow the instructions to add it to your accounts.

4) Import some dashboards

You can now use the Quickstarts nerdlet in New Relic. Try it out by importing some dashboards. If you have any feedback or ideas, don't hesitate to create a ticket.
