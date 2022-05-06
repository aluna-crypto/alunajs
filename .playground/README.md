# AlunaJS / Playground

Test things out quick and easy.

<!--
Live API explorer:
  - http://playground.aluna.social -->

# TL;DR

```bash
yarn playgropund
```

## AlunaRC
> Before moving on, be sure to set up your `.alunarc`:
> - [Setting up `.alunarc`](../docs/alunarc.md)


# Insomnia

Insomnia is a REST spec / explorer tool that we use for this purpose.

Let's get started:.

1. Download and install [Insomnia](https://insomnia.rest/)
1. Install Insomnia [dotenv](https://insomnia.rest/plugins/insomnia-plugin-dotenv) plugin
1. Create an `.alunarc` file and place it on your `$HOME` folder
   - Example template file at `.playground/.alunarc`
   - Configure all desired API keys and secrets
  1. Then, back on Insonia, go to `Data` -> `Import Data` -> `From File`
  2. Import the file `<repo-root>/.playground/playground.json` file
  3. Voilà


# Start the Server

This will start the Playground http server:

```bash
yarn playgropund
```

# Explore API

On Insomnia, select the desired Exchange:

`<image-here>`

Then try out all the available methods:

`<image-here>`
