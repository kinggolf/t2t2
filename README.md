# TheDocketClient

# Following angular cli commands to start this project

`ng new the-docket-client`

`cd the-docket-client`

`ng add @angular/pwa --project the-docket-client`

Upgraded a handful of node-modules to latest versions.

`ng add @angular/material @angular/cdk @ngrx/store`

From services folder: `ng generate service auth` & `ng generate service todos`

From components folder: `ng generate component login` & `ng generate component todo-list`

`ng build --prod`


#Concepts used

@angular/pwa

@angular/material

material-design-icons

@ngrx/store

@angular/reactive forms

HTTP Interceptor


# Discussion on service workers

`manifest.json` file defines application basics, e.g. icons, theme info, ...

`ngsw-config.json` file defines service worker specifics for the application. 
There are 3 objects at the top level of this json file, "index", "assetGroups", and
"dataGroups". "assetGroups" are fixed assets that come from the bundle and 
"dataGroups" defines downloaded data and various caching information. This link to
[angular.io service worker section](https://angular.io/guide/service-worker-config#service-worker-configuration) 
provides documentation on configuring service workers inside an angular app.


the-docket-client app is using `"@angular/cli": "~7.3.5"` and there seems to be an issue with
this and the `@angular/pwa` in terms of registering service workers, see this
[link](https://github.com/angular/angular-cli/issues/13351). Based on this I 
added 
```
platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker.register('/ngsw-worker.js');
  }
}).catch(err => console.log(err));
```
to the `main.ts` file. This seems to register the sw just fine.

In order to test the service worker locally, install the npm http-server package
as follows: `npm install http-server -g`, per recommendation by 
[angular.io](https://angular.io/guide/service-worker-getting-started#serving-with-http-server).

Then run following 2 commands:

`ng build --prod` and `http-server -p 8080 -c-1 dist/the-docket-client`

and the app will operate normally with registered service workers and offline 
performance.

I had a particularly difficult time caching material icons, so here is an
explanation of what I did:

Initially material icons were loading from 

`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

in `index.html`. I expected these icons to be lazily cached based on
`ngsw-config.json` under assetGroup - resource - files section. I also tried
specifying the url, but no! Here is what ended up working: 

`npm install material-design-icons`

and adding to `angular.json`

`"./node_modules/material-design-icons/iconfont/material-icons.css",`

under styles, plus adding `"/MaterialIcons-Regular.*"` to `ngsw-config.json` under 
prefetched resources.

This all seems to work on local http-server.

The app currently has no ability to sync any changes made offline, so these will
be lost. There seem to be strategies on saving these updates locally and the
completing them when the app comes back online, e.g. in this 
[link](https://stackoverflow.com/questions/35270702/can-service-workers-cache-post-requests).
