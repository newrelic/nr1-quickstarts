# Installation

To use quickstarts in your accounts you will need the NR1 CLI, [instructions can be found here](https://one.newrelic.com/launcher/developer-center.launcher?pane=eyJuZXJkbGV0SWQiOiJkZXZlbG9wZXItY2VudGVyLmRldmVsb3Blci1jZW50ZXIifQ==).

After you've succcesfully installed the CLI, run the following commands:

1. Go to nerdlet directory: `cd packages/nerdlet/`
2. Publish nerdpack into your personal account: `nr1 nerdpack:publish --channel=STABLE`
3. Deploy the pack: `nr1 nerdpack:deploy --channel=STABLE`

You should now see the Quickstarts nerdlet if you go to `Apps` in New Relic One. Follow the instructions to add it to your accounts.
