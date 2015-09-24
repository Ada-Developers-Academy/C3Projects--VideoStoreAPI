## Brittany is Awesome

just saying.

### Jeri's notes to self

- wrap seeds & schema in module.exports
- that annoying line is definitely supertest
  - actually turns out it's morgan
  - comment out line `app.use(logger('dev'));` to remove logging info from server / test runner
    - that line is right after the favicon stuff
- ROUTES controller.customers is executing in the context of the .get, not in the context of controller
  - using controller.customers.bind(controller) will bind the context to the controller object
  - or you can use `controller.thing` instead of `this.thing`

### Jeri's notes about fixing the sql error handler

hmmmm



.
