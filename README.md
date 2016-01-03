# logiciel-de-caisse

Logiciel de caisse Open Source par commande-online.fr SAS avec license GNU GPL

'WORK IN PROGRESS'

'EN COURS DE DEVELOPPEMENT'

## Prerequisite

Pour utiliser ce logiciel, il vous faut un compte (gratuit) sur http://www.commande-online.fr. Il est important de noter que ce logiciel est un exemple de ce qui peut se faire avec l'API mis à dispoition par Commande-Online.fr SAS

In order to use this software, you need a free account on http://www.commande-online.fr. It is important to note that this software is a live example that represents some of the capabilities of Commande-Online.fr SAS API.

## Before installation

Please clone the repository to get all the files. Make sure to update the app.js file with the proper URL of your API server.  
Don't hesitate to contact commande-online.fr in case of a doubt.

## Angular Testing 

Karma and Jasmine needs to be installed : 

1. npm install karma --save-dev  <= important pour que phpStorm execute les tests
2. npm install -g karma --save-dev
3. npm install -g karma-jasmine jasmine-core
4. npm install -g karma-chrome-launcher
5. npm install -g karma-coverage
6. npm install angular-mocks

I've followed this tutorial : https://www.airpair.com/angularjs/posts/unit-testing-angularjs-applications