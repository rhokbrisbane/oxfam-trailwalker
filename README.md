# Find Me A Walk

## About 
Inspired by Oxfam Trailwalker volunteers, [findmeawalk.com](https://findmeawalk.com/) is a new mapping tool to help people locate popular walking trails nearby saving time, making it easy for poeple to get fit, get out and explore new places with friends.


## Development
* Find Me A Walk is built using [React](https://facebook.github.io/react/) and [Mobx](https://mobx.js.org/)
* Specifically, all the things from the [Create React App User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) apply here.

### Getting started
* Check out this repo
* First, `npm install` to install the dependencies
* Then, `npm start` to run the development server
* `npm run test` and `flow check` to run tests

### Structure
* `public/` - anything in here is copied out to the production deploy. `index.html` is pretty much what is loaded when users hit the site
* `src/` - the meat of the app
  * `api/` - external calls to services/api's
  * `components/` - react components which make up the views, these are generally pretty dumb and just render the state they're given through the props
  * `styles/` - css fun
  * `index.js` - the entry point, but that basically just renders `App.js`
  * `App.js` - probably where you'll want to start, contains the root react view
  * `State.js` - all the state for the app (current loaded walk, where we're looking, etc) as well as all the actions to modify that state, more in State down below
  * `Types.js` - Flow types for static type checking

### State
Mobx has [fairly in-depth docs](https://mobx.js.org/), but the general gist is:

* Pieces of state data are marked `@observable`
* Anything which modifies these pieces of state are marked as `@action.bound`
  * the `.bound` part is so that references to `this.whatever` work properly
  * We're using strict mode, so anything that modifies state has to be in an action (just to keep everything in one place)
* Reactions to state changing are performed in `reaction(reactTo, action)` blocks, where `reactTo` contains the pieces of state we want to react to when they change, and `action` is the action we want to take
* If we just need to do react to something once, use `when(reactTo, action)`, which works in a similar way to `reaction` but only fires once
* `@computed` is used to create convenience properties which are computed from the state
* `intercept` is used to change values in-flight, eg. we use it to normalize values

So as an example, we keep track of the current target length we want to search for, its Flow type is a number and it defaults to the constant `DEFAULT_ROUTE_TARGET_LENGTH`:

```
  @observable targetLength: number = DEFAULT_ROUTE_TARGET_LENGTH;
```

We have a few actions to change the target length

```
  @action.bound wantLongerWalk() {
    this.targetLength *= ROUTE_LENGTHENING_PERCENTAGE;
  }

  @action.bound wantShorterWalk() {
    this.targetLength /= ROUTE_LENGTHENING_PERCENTAGE;
  }
```

And when that target length changes we have a reaction to look for another walk closer to that length

```
    reaction(
      () => this.targetLength,
      () => this.findAnotherWalk(),
      { name: "Look for a new walk when we change target length" }
    );
```


## Contributing
We love contributions! Pull Requests to fix bugs or implement anything on our [Trello wishlist](https://trello.com/b/fNAxsQG4/find-me-a-walk) are very appreciated.

Pull Requests from local branches will be automatically deployed for testing by Travis (unfortunately we can't do this for remote branches).