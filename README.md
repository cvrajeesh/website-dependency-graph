# Website Dependency Graph (wdg)

A command-line tool to generate assets dependency graph from static website files.

Analyzes all the HTML, JavaScript and CSS files to find all the dependent assets, then generates a dependency graph. This graph includes only the internal assets, any assets linked to external URLs are excluded.

## Getting started

###

```
# Install using NPM
npm install -g website-dependency-graph

# Install using Yarn
yarn global add website-dependency-graph
```

### Usage

```
$ wdg <source directory>
```

`wdg` requires a path to your website directory as an argument to generate the dependency graph.
