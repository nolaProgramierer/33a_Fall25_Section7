# Django/React Hybrid App
## An App demonstrating CRUD operations on a Piano Inventory
### HES CSCI E-33a
You don't have to give up all the advantages of using a fully-featured framework like Django in order to take advantage of React.  This application serves a React app as a static asset in a Django template.  In order to build such an app you'll need the following:
1. A functional Django project and app
2. NPM, a package manager
3. Webpack, a bundler
4. Babel, a compiler
5. The Django Rest Framework to handle the serializations in our Django backend gracefully

The first step is to add some files and folders to our regular Django project structure. There are many ways to do this, but I've chosen to stick closely to the structure we've used in the course. It's intutive and clean.  

This will not be a complete how-to as all the files necessary to run the app are within the repo.  However in this README, I'll explain what's in the relevant files.

I've added the following in the application folder, *piano_inventory*:
1. a component folder: contains my React components
2. a frontend/piano_inventory: contains my source React/JS file
3. in the above folder an *index.js* file, which will be the root of my React app

In the root directory of the project install webpack.

`npm init -y`
`npm install webpack webpack-cli --save-dev`

This will create a *package.json* and a *package-lock.json* file
Note: *nodule_modules* should be in your *.gitignore* file

Install React and Babel
`npm install — save-dev @babel/core @babel/preset-env @babel/preset-react`
`npm install --save react react-dom`

Create an *index.js* in your *front_end/piano_inventory* folder.  You can put a simple JS function there for the time being or if you have a React app, your root component that will be rendered.

Next, create a *webpack.config.js* in the application root directory.

Finally, add a *scripts* key to the *package.json* file as shown in the repo which will allow us to run webpack from the terminal.
`"scripts": {
    ...
    "dev": "webpack --mode development --watch"
  },`

In *webpack.config.js* there are 3 key:value pairs.  The 1st, *entry*, sets the location of the source JS files.  The 2nd, *output*, sets the filename of the bundled JS and the absolute path to the output file location.  The *module* key uses Babel's *env* and *react* presets to compile (transpile) the JS files.

In the terminal `run npm dev` should execute the webpack script and if no errors, create and place the bundled JS file in the *static/piano_inventory* folder.  Note that this is the same folder we've used throughout the semester for our static files. JS and CSS.

The React pipeline in Django is the follwoing:
1) *front_end/piano_inventory/index.js* contains the root of the React app. You'll notice that the root is being assigned to a div, *js-framework-home*
2) The bundler outputs the minified React file(s) to the *static/piano_inventory/indexBundle.js* file.
3) In the *templates/piano_inventory/index_inventory.html* file the bundled JS file in step 2 is called as a script on line 17. Remember, that React is being served as a static asset.  This is really no different than calling any JS script you've written in an external JS file.  The only difference being its React JS.
4) Notice the empty div in the template, mentioned in step 3, with the id *js-framework-home*  That is where the bundled JS file is being inserted. Not entirely dissimilar from what you did in the Mail app.
5) When you go to (http://127.0.0.1:8000/index_inventory) in the browser address bar, React should be running within that template.
    
That's pretty much it as far as getting React/JS to render in a Django template.  What we have to do is now hook up our Django backend to the React front-end.

Install the Django Rest Framework
`pip install djangorestframework`
You'll need to add `rest_framework` to your project *settings.py* file.
This would probably be a good time to make a *serializers.py* file in your application directory as well.

The Django Rest Framework documentation is excellent so I'm not going to duplicate it here, but I will point out the repo's files, liberally commented, that will connect with your React front-end.

In the *serializers.py* file are what the Django Rest Framework needs to handle the serialization of the model objects defined in the *models.py* file.  We need a way to convert Django model objects to Python native data types and finally to JSON objects.
You'll notice in the *urls.py* file, lines 14-18, are the routes that the React front-end is calling.  They in turn call the appropriate views in *views.py*, similar to what we've done all semester, and return JSON responses to the React front-end.

From what you've already done this semester, the code in in the *views.py* file, lines 88-147, shoudn't look too unfamiliar.  We're retrieving querysets or model instances, serializing/unserializing them, saving to the database, and returning a response to the front-end.  For more detail on the step-by-step implementation, consult the Django Rest Framework documentation.

Finally, in the *piano_inventory/components/App.js* file, line 18, you can see the url the front-end is using to call the Django backend. 

`// Url of Django api`
`const url = `http://127.0.0.1:8000/api/pianos/`

That route corresponds to a path in the Django *urls.py* which returns the *piano_list* view.

The *fetchData* function within the React *useEffect* hook is very similar, aside from the React state variables, to a browser's *fetch* utility.

Again, this README isn't meant to be a step-by-step tutorial, but simply a further explanation of the Section material and of the code posted in this repository.  Feel free to email me any questions you may have about the code or the implementation of a hybrid app such as this one.  You are also free to fork this repository and use it as a basis for your own work, should you desire.
