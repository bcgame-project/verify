# Game Verifiers

Static HTML game site with a local dev server.

A collection of standalone, provably-fair game verifier pages — baccarat, blackjack, crash,
dice, keno, mines, plinko, roulette, slots and more — each a self-contained HTML file that
runs entirely in the browser.

## Live site

https://kenn2chill0917-star.github.io/verify/

## Local development

Requires Node.js 18 or newer. There are no runtime dependencies to install — the dev server
uses only Node builtins.

```sh
npm start
```

This serves the repository root at <http://localhost:8080>. Use `npm run dev` for the same
thing, and set `PORT` to listen elsewhere:

```sh
PORT=3000 npm start
```

## Repository layout

| Path | Contents |
| --- | --- |
| `index.html` | Index page linking every verifier |
| `*.html` | The individual game verifiers |
| `lib/` | Vendored browser assets (Bootstrap, jQuery, React, Vue, crypto-js, …) |
| `serve.mjs` | The static dev server behind `npm start` |
| `src/`, `examples/`, `Cargo.toml` | The `solanagun-quic` Rust crate — see [SOLANAGUN-QUIC.md](SOLANAGUN-QUIC.md) |
| `.github/workflows/` | CI and deployment |

[blackjack_readme.md](blackjack_readme.md) documents the rules the blackjack verifier
implements.

## Deployment

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publishes the
repository to GitHub Pages on every push to `main`, and can also be triggered manually. The
whole repository is uploaded as the Pages artifact, so each verifier is reachable at its
own path — for example `/dice.html`.

## License

This project is dual-licensed under either of

  * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
    <https://www.apache.org/licenses/LICENSE-2.0>)
  * MIT License ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option. This covers both the `verify-games` package and the `solanagun-quic` crate;
see [LICENSE](LICENSE) for a summary.

Copyright (c) 2026 kenn2chill0917-star

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
