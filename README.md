# Website Dependency Graph (wdg)

A command-line tool to generate assets dependency graph from static website files.

Analyzes all the HTML, JavaScript and CSS files to find all the dependent assets, then generates a dependency graph. This graph includes only the internal assets, any assets linked to external URLs are excluded.

![wdg-demo](https://media.giphy.com/media/Kf5hCcSqRbLOeBn6vT/source.gif)

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
$ wdg <source dir> [--output]
```

`wdg` requires a path to your website directory as an argument to generate the dependency graph.

Supports two output formats

- `html` [default] - generates an HTML file in temp directory.
- `dot` - generates dependency graph in [Graphviz](https://graphviz.org) DOT format and writes to standard output.

e.g. generate dependency graph image using Graphviz `dot` command-line utility.

```
$ wdg <source dir> --output dot | dot -Tpng -o website.png
```
