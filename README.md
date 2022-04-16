# frappe-js-sdk
TypeScript/JavaScript library for Frappe REST API - Work in progress 🚧


The library currently supports the following features:

1. Authentication - login with username and password
2. Database - Get document, get list of documents, create, update and delete documents

We plan to add the following in the future:
1. Authentication with OAuth clients
2. File upload
3. API calls to server scripts

The library uses Axios under the hood to make API calls to your Frappe backend.
## Initialising the library

To get started, initialise the library:

```js
import { FrappeApp } from "frappe-js-sdk";
//Add your Frappe backend's URL
const frappe = new FrappeApp("test.frappe.cloud")

```

## Authentication

#### Initialise the auth library

```js
const auth = frappe.auth()
```

#### Login a user:

This makes an API call to the `/api/method/login` endpoint.
```js
auth.loginWithUsernamePassword({ username: "admin", password: "my-password" })
    .then(response => console.log("Logged in"))
    .catch(error => console.error(error))
```

#### Get currently logged in user:

This makes an API call to the `/api/method/frappe.auth.get_logged_user` endpoint.
```js
auth.getLoggedInUser()
    .then(user => console.log(`User ${user} is logged in.`))
    .catch(error => console.error(error))
```

#### Logout:

This makes an API call to the `/api/method/logout` endpoint.
```js
auth.logout()
    .then(() => console.log("Logged out."))
    .catch(error => console.error(error))
```


## Database

#### Initialise the database library

```js
const db = frappe.db()
```
#### Fetch document using document name

```js
db.getDoc("DocType", "My DocType Name")
    .then(doc => console.log(doc))
    .catch(error => console.error(error))
```

#### Fetch list of documents

```js
db.getDocList("DocType")
    .then(docs => console.log(docs))
    .catch(error => console.error(error))
```

Optionally, a second argument can be provided to filter, sort, limit and paginate results.

```js
db.getDocList("DocType", {
        /** Fields to be fetched */
        fields: ["name", "creation"],
        /** Filters to be applied - SQL AND operation */
        filters: [["creation", ">", "2021-10-09"]],
        /** Filters to be applied - SQL OR operation */
        orFilters: [],
        /** Fetch from nth document in filtered and sorted list. Used for pagination  */
        limit_start: 5,
        /** Number of documents to be fetched. Default is 20  */
        limit: 10,
        /** Sort results by field and order  */
        orderBy: {
            field: "creation",
            order: 'desc'
        },
        /** Fetch documents as a dictionary */
        asDict: false
    })
    .then(docs => console.log(docs))
    .catch(error => console.error(error))
```

Type declarations are available for the second argument in the source code.


#### Create a document
To create a new document, pass the name of the DocType and the fields to `createDoc`.
```js
db.createDoc("My Custom DocType", {
        "name": "Test",
        "test_field": "This is a test field"
    })
    .then(doc => console.log(doc))
    .catch(error => console.error(error))
```


#### Update a document
To update an existing document, pass the name of the DocType, name of the document and the fields to be updated to `updateDoc`.
```js
db.updateDoc("My Custom DocType", "Test", {
        "test_field": "This is an updated test field."
    })
    .then(doc => console.log(doc))
    .catch(error => console.error(error))
```

#### Delete a document
To create a new document, pass the name of the DocType and the name of the document to be deleted to `deleteDoc`.
```js
db.deleteDoc("My Custom DocType", "Test")
    .then(response => console.log(response.message)) // Message will be "ok"
    .catch(error => console.error(error))
```

## Usage with Typescript
The library supports Typescript out of the box. 
For example, to enforce type on the `updateDoc` method:

```ts
interface TestDoc {
    test_field: string
}
db.updateDoc<TestDoc>("My Custom DocType", "Test", {
        "test_field": "This is an updated test field."
    })
```

The library also has an inbuilt type `FrappeDoc` which adds the following fields to your type declarations when you use it with the database methods:

```ts
export type FrappeDoc<T> = T & {
  /** User who created the document */
  owner: string;
  /** Date and time when the document was created - ISO format */
  creation: string;
  /** Date and time when the document was last modified - ISO format */
  modified: string;
  /** User who last modified the document */
  modified_by: string;
  idx: number;
  /** 0 - Saved, 1 - Submitted, 2 - Cancelled */
  docstatus: 0 | 1 | 2;
  parent?: any;
  parentfield?: any;
  parenttype?: any;
  /** The primary key of the DocType table */
  name: string;
};
```

All document responses are returned as an intersection of `FrappeDoc` and the specified type.