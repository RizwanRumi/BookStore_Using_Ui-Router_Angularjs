/// <reference path="../Scripts/angular.js" />


var AuthorService = angular.module('AuthorService',[]);


AuthorService.factory('AthrApi', ['$http', function ($http) {
    
    var urlBase = "http://localhost:9235/api/Authors";
    var AthrApi = {};

    AthrApi.getAuthors = function () {
        return $http.get(urlBase);
    }

    AthrApi.getAuthor = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    AthrApi.insertAuthor = function (auth) {
        return $http.post(urlBase, auth);
    };

    AthrApi.updateAuthor = function (auth) {
        return $http.put(urlBase + '/' + auth.AuthorId, auth)
    };

    AthrApi.deleteAuthor = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    

    return AthrApi;
}]);


var BookService = angular.module('BookService', []);


BookService.factory('BookApi', ['$http', function ($http) {

    var urlBase = "http://localhost:9235/api/Books";
    var BookApi = {};

    BookApi.getBooks = function () {
        return $http.get(urlBase);
    }

    BookApi.insertBook = function (book) {
        return $http.post(urlBase, book);
    };

   
    return BookApi;
}]);


var FileService = angular.module('FileService', []);


FileService.factory('FileApi', ['$http', function ($http) {

    var urlBase = "http://localhost:9235/api/Files";
    var FileApi = {};

    FileApi.UploadImage = function (data) {
        return $http.post(urlBase, data, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    }

    return FileApi;
}]);