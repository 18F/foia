[![CircleCI](https://circleci.com/gh/18F/foia.svg?style=svg)](https://circleci.com/gh/18F/foia)

# foia

New FOIA beta site + national portal. The site is based off of
[18F recommendations](https://github.com/18F/foia-recommendations) from our
discovery sprint with the Department of Justice.


## Development

### Prequisites

* [Ruby](https://www.ruby-lang.org/en/) 2.3.4 (specified in `.ruby-version`)
* bundler

### Ruby

You can manage multiple versions of ruby using [rvm](https://rvm.io/).


### Setup

Install the dependencies.

    $ gem install bundler
    $ bundle install

Build the site.

    $ make build

Run the tests.

    $ make test

Run the site locally.

    $ make serve

And open your browser to http://localhost:4000/.

See more in the [README.md](www.foia.gov/README.md).
