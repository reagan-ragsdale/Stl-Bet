# RemultAngularTodo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## TODO

Batch script to run all api calls once a day

Game props and stats

Add a multi player prop parlay screen (currently only pplayers on the same team) and be able to select their props and show how often that parlay hits

Possibly look at calling the api and updating the table to player id and game id != instead of deleting and re inserting everything. IT's gonna keep growing in time as the number of games increases




## Notes
Learned an interesting thing today. Was working in the player stats screen and was trying to display the table data in reverse order to show the most recent at the top. 
I created a new array of nbaplayerstats[] and set it equal to the current nba player stats I was using for the graphs
I then performed a reverse function on the new array but I noticed the graphs were also being reversed as well.
It turns out that data types such as objects act different than primitives such as strings
When setting a string equal to another string, it creates two separate string in memeory
string a = 'hello'
string b = a
a = hello
b = hello
Both a and b are two separate storages

With an object, when you set one equal to the other. It it only a reference to the storage
objA = {name: reagan}
abjB = abjA
abjA => {name: reagan}
objB => [name: reagan]

objB is not a new object that has the same values as objA. They both point to the reference of what the object is. So unlike the strings where there are two, in the objects there are only one

To overcome this I used a new function called structuredClone() which creates a copy of the supplied object and sets the new object to that copy


Things to do moving forward:
Create develop branch --
Set up postgress database -- 
Imporove speed of api calls and getting and putting in database --

Things to accomplish over break:
Automate loading stats into database daily
Set up team stats
Make mobile view and responsive layouts



