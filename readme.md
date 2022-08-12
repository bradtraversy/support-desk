# Support Desk App

Support ticket application built with the MERN stack. This is a project from my [React Front To Back](https://www.udemy.com/course/react-front-to-back-2022/?referralCode=4A622C7E48DB66154114) course.

# Bug Fixes, corrections and code FAQ

This branch aims to fix bugs found by students of the Udemy course and answer common questions, it also features [simpler state management](#simpler-state-management) than the course code.
If you are looking to compare your code to that from the course lessons then
please refer to the [originalcoursecode](https://github.com/bradtraversy/support-desk/tree/originalcoursecode) branch of this repository.

There are detailed notes in the comments that will hopefully help you understand
and adopt the changes and corrections.
An easy way of seeing all the changes and fixes is to use a note highlighter
extension such as [This one for VSCode](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight) or [this one for Vim](https://github.com/folke/todo-comments.nvim) Where by you can easily list all the **NOTE:** and **FIX:** tags in the comments.

#### BUG: Sending a 2xx response instead of a bad response

Currently in the course code there are cases where we throw an error in our API
routes but we didn't set a response status code. So we end up sending a 2xx
(good) response with an error message to our client when really this should be a
bad response.

Our errorMiddleware should only send bad responses to our client. What we can
do is check the current response status code and if it is less than 400
(therefore a good response) we can change it to a bad response status code.

> Code changes can be seen in [errorMiddleware.js](./backend/middleware/errorMiddleware.js)

#### Q: Why are we querying the user in our noteController?

We already have our currently authenticated user in our req object from our
authMiddleware and we can access this in our controllers with `req.user` so
there is no need to again query the database for a user in these route handlers.

> Code changes can be seen in [noteController.js]('./backend/controllers/noteController.js')

#### BUG: App crashes on refresh in deployment

The path to the build fails to resolve when the browser is refreshed causing the
app to crash.

> Code changes to fix this can be seen in [server.js](./backend/server.js#L26)

#### BUG: User is still authenticated if they don't exist in the database

Currently if no user was found in our authMiddlware, we
still call `next()` bypassing any kind of route protection.
If no user is found in our database then we need to send back a unauthorized
response and not call `next()`.

> Code changes for this fix can be seen in [authMiddleware.js]('./backend/middleware/authMiddleware.js#L19')

#### Q: Why are we using nested routes in App.js

There is no need for nested routing here as the route is the same as the parent,
this can be removed and PrivateRoute can be changed to render it's children.

> Code changes can be seen in [App.js](./frontend/src/App.js) and
> [PrivateRoute.js](./frontend/src/components/PrivateRoute.jsx)

#### Q: Why are we using a custom hook in our PrivateRoute?

Normally you would create a custom hook where you need to share some kind of
logic in many different components. Since we only use our useAuthStatus hook in
our PrivateRoute component it's actually simpler to just consume Redux state
directly in our PrivateRoute without using a custom hook.

> Code changes can be seen in [PrivateRoute.js](./frontend/src/components/PrivateRoute.jsx) with the removal of useAuthStatus.js

#### Q: Why the repetitive code to get an error message?

We currently have the same logic to get the error message repeated in multiple
AsyncThunks in our authSlice, ticketSlice and noteSlice.
So this is a clear opportunity to dry up our code a little and extract this logic
to it's own function.

> Code changes can be seen in [utils.js](./frontend/src/utils.js), [authSlice.js](./frontend/src/features/auth/authSlice.js), [ticketSlice.js](./frontend/src/features/tickets/ticketSlice.js) and [noteSlice.js](./frontend/src/features/notes/noteSlice.js)

#### Q: Why is logging out a user a AsyncThunk?

For logging out a user all we are doing is removing the user from local storage,
we are not doing any async work or making any requests to our backend. You may
even see warnings in your editor about using async await in synchronous code.
We don't need to use an AsyncThunk here and can simply use a plain action.

> Code changes can be seen in [authSlice.js](./frontend/src/features/auth/authSlice.js#L45)

#### BUG: PrivateRoute never shows a Spinner

It won't. When a user enters the app on a PrivateRoute such as **/tickets**
then we never actually make any reqeust to the backend to authenticate them. We
have a user in local storage and in Redux or we don't. If we do have a user then
we trust the user is authenticated. This doesn't really take any time as all we
are doing is getting the user from our Redux store. If we were making a request
to the back end to authenticate the user then we could indeed make use of
`isLoading` and a Spinner here in our PrivateRoute.
Since it's not used it can be removed.

> Code changes can be see in [PrivateRoute.js](./frontend/src/components/PrivateRoute.jsx)

## Simpler state management

#### Tickets and note state

Our ticket and note state in Redux can be simplified by removing `isLoading`, `isSuccess`, `isError` and `message` from state.

There is no real need for `isLoading` or `isSuccess` as this can be inferred from
presence or absence of data - i.e. If we have tickets then we are not loading and we
successfully got our tickets, if we don't have tickets then we are loading the
tickets. We either have the tickets or we are loading the tickets.
For more advice on if you should use loading booleans or not then [this article
from Kent C Dodds](https://kentcdodds.com/blog/stop-using-isloading-booleans) is
a very informative read.

We also don't need a reset function as we can reset our state in our pending
case that we get from using an AsyncThunk. Relying on state being explicitly
reset with it's own action did cause some bugs for students with redirection and
tickets not showing, so if that sounds like something you are experiencing then
this is likely the fix you need.
It was also a little complex to reason about if and when you needed to
reset state from your components.

For our error and failures to fetch tickets or notes, by using an AsyncThunk we
can [ unwrap ](https://redux-toolkit.js.org/api/createAsyncThunk#unwrapping-result-actions) the original Promise at component level. This also removes the need
for a useEffect to monitor state and show an error message to the user if for
whatever reason we got a bad response.

We can also unwrap our Promise on form submission when creating a ticket or
note, which again removes the need for a useEffect to watch state. If we
successfully create a ticket then we can redirect the user, if we failed to
create a ticket then we can show the user the error message from our API.
This follows the React advice for [keeping side effects in event handlers where
possible](https://beta.reactjs.org/learn/keeping-components-pure#where-you-can-cause-side-effects) i.e. not using a useEffect if you don't have to.

> Changes and detailed notes can be seen in [ticketSlice.js](./frontend/src/features/tickets/ticketSlice.js), [noteSlice.js](./frontend/src/features/notes/noteSlice.js), [Tickets.jsx](./frontend/src/pages/Tickets.jsx) and [Ticket.jsx](./frontend/src/pages/Ticket.jsx)

#### Auth state

Similar to ticket and note state, we don't really need an `isError` or `message`
part to our state as again we can unwrap the Promise from our AsyncThunk at
component level. This allows us to do something when the Promise is resolved -
_like redirecting the user after login and showing a success message with the
users name_, or do something else if the Promise was
rejected - _like showing a toast error message_. Unwrapping our original Promise
also removes the need in our Login and Register components for a useEffect to
watch state as we can handle this all in our `onSubmit` event handlers.
Since the only places we need `isError` or `message` was in Login and Register,
this doesn't really need to be in Redux state.

> Changes can be seen in [authSlice.js](./frontend/src/features/auth/authSlice.js), [Login.jsx](./frontend/src/pages/Login.jsx) and [Register.jsx](./frontend/src/pages/Register.jsx)

## Usage

### Set Environment Variables

Rename the .envexample to .env and add your [MongoDB](https://www.mongodb.com/) database URI and your JWT secret

### Install backend dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd frontend
npm install
```

### Run app in development (frontend & backend)

```bash
npm run dev
```
