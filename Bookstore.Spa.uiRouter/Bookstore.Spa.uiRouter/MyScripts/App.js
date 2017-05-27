/// <reference path="../Scripts/angular.js" />



var MyApp = angular.module("MyApp", ['ui.router', 'ui.bootstrap', 'AuthorService', 'BookService', 'FileService']);

MyApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {

        //$locationProvider.html5Mode(true);
        
        $stateProvider.
         state('Author', {
             url: '/Author',
             templateUrl: 'Views/Author/AuthorList.html',
             controller: 'AuthorController'
         });
        //state('/Add', {
        //    templateUrl: 'Views/Author/AddAuthor.html',
        //    controller: 'AddAuthorController'
        //}).
        //state('/Details/:id', {
        //    templateUrl: 'Views/Author/DetailAuthor.html',
        //    controller: 'DetailAuthorController'
        //}).
        //state('/Edit', {
        //    templateUrl: 'Views/Author/EditAuthor.html',
        //    controller: 'EditAuthorController'
        //}).
        //state('/Delete/:id', {
        //    templateUrl: 'Views/Author/DeleteAuthor.html',
        //    controller: 'DeleteAuthorController'
        //}).
        //state('/Book', {
        //    templateUrl: 'Views/Book/BookList.html',
        //    controller: 'BookController'
        //});

        $urlRouterProvider.otherwise('/Author');
    }]);

MyApp.controller("AuthorController", ['$scope', '$window', 'AthrApi', function ($scope, $window, AthrApi) {
    //$scope.PageTitle = "Author List";
    $scope.Authors = [];

    $scope.Message = "";

    getAuthors();

    function getAuthors() {

        $scope.TotalData = [];

        AthrApi.getAuthors()
            .then(function (response) {
                $scope.TotalData = response.data;

                $scope.currentPage = 1;
                $scope.numPerPage = 5;
                $scope.maxSize = 5;
                $scope.totalCount = response.data.length;

                $scope.$watch('currentPage + numPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                    $scope.Authors = $scope.TotalData.slice(begin, end);
                });


            });

    };

    $scope.states = {
        clearAuthorForm: false,
        errorInitials: false,
        errorFirstName: false,
        errorLastName: false,
        errorAddress: false,
        errorZipCode: false,
        errorCountry: false

    };

    $scope.new = {
        Author: {}
    };

    $scope.clearAuthorForm = function (show) {
        $scope.states.errorInitials = false;
        $scope.states.errorFirstName = false;
        $scope.states.errorLastName = false;
        $scope.states.errorAddress = false;
        $scope.states.errorZipCode = false;
        $scope.states.errorCountry = false;
        $scope.Message = "";
        $scope.new.Author = {};
    };

    //Error checking
    $scope.errorInitStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorInitials = false;
        }
        else {
            return $scope.states.errorInitials = true;
        }
    };

    $scope.errorFNameStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorFirstName = false;
        }
        else {
            return $scope.states.errorFirstName = true;
        }
    };

    $scope.errorLNameStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorLastName = false;
        }
        else {
            return $scope.states.errorLastName = true;
        }
    };

    $scope.errorAdrStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorAddress = false;
        }
        else {
            return $scope.states.errorAddress = true;
        }
    };

    $scope.errorZipStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorZipCode = false;
        }
        else {
            return $scope.states.errorZipCode = true;
        }
    };

    $scope.errorCntryStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorCountry = false;
        }
        else {
            return $scope.states.errorCountry = true;
        }
    };


    $scope.saveAuthor = function () {
        var inits = $scope.errorInitStateChange($scope.new.Author.Initials);
        var fName = $scope.errorFNameStateChange($scope.new.Author.FirstName);
        var lName = $scope.errorLNameStateChange($scope.new.Author.LastName);
        var addr = $scope.errorAdrStateChange($scope.new.Author.Address);
        var zcode = $scope.errorZipStateChange($scope.new.Author.ZipCode);
        var cntry = $scope.errorCntryStateChange($scope.new.Author.Country);


        if (Boolean(inits) == false && Boolean(fName) == false && Boolean(lName) == false &&
            Boolean(addr) == false && Boolean(zcode) == false && Boolean(cntry) == false) {

            $scope.new.Author.AuthorId = 0;

            var athr = $scope.new.Author;

            var msg = $scope.Message;


            AthrApi.insertAuthor(athr)
              .then(function (response) {
                  // $scope.Authors.push($scope.new.Author);
                  $scope.new.Author = {};
                  $scope.Message = "";
                  $window.location.reload();
                  //  $('#authorModal').modal('hide');

              }, function (error) {
                  $scope.Message = error.message;
                  $("#msgView").css('color', 'red');
              });
        }


    };

    $scope.goToDetails = function (id) {
        location.href = '#!/Details/' + id;
    }

}]);

MyApp.controller("AddAuthorController", function ($scope) {  
    $scope.message = "Add Author";
});

MyApp.controller("DetailAuthorController",['$scope','$location','$window', '$routeParams', 'AthrApi', function ($scope, $location, $window, $routeParams,AthrApi) {
    
    $scope.Author;
   
    var getId = $routeParams.id;
    getAuthor(getId);

    function getAuthor(getId) {
        AthrApi.getAuthor(getId)
            .then(function (response) {
                $scope.Author = response.data;
            }, function (error) {
                $scope.status = 'Unable to load author data: ' + error.message;
            });
    }

    $scope.states = {
        clearAuthorForm: false,
        errorInitials: false,
        errorFirstName: false,
        errorLastName: false,
        errorAddress: false,
        errorZipCode: false,
        errorCountry: false
    };

    

    $scope.clearAuthorForm = function (show) {
        $scope.states.errorInitials = false;
        $scope.states.errorFirstName = false;
        $scope.states.errorLastName = false;
        $scope.states.errorAddress = false;
        $scope.states.errorZipCode = false;
        $scope.states.errorCountry = false;
        $scope.Message = "";
        $('#editAuthorModal').modal('hide');
    };

    //Error checking
    $scope.errorInitStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorInitials = false;
        }
        else {
            return $scope.states.errorInitials = true;
        }
    };

    $scope.errorFNameStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorFirstName = false;
        }
        else {
            return $scope.states.errorFirstName = true;
        }
    };

    $scope.errorLNameStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorLastName = false;
        }
        else {
            return $scope.states.errorLastName = true;
        }
    };

    $scope.errorAdrStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorAddress = false;
        }
        else {
            return $scope.states.errorAddress = true;
        }
    };

    $scope.errorZipStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorZipCode = false;
        }
        else {
            return $scope.states.errorZipCode = true;
        }
    };

    $scope.errorCntryStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorCountry = false;
        }
        else {
            return $scope.states.errorCountry = true;
        }
    };

    $scope.EditAuthormdl = {};
  

    $scope.EditAuthorModel = function (item) {     
        $scope.EditAuthormdl = item;
    };

    $scope.updateAuthor = function (editAuthor) {
        var inits = $scope.errorInitStateChange(editAuthor.Initials);
        var fName = $scope.errorFNameStateChange(editAuthor.FirstName);
        var lName = $scope.errorLNameStateChange(editAuthor.LastName);
        var addr = $scope.errorAdrStateChange(editAuthor.Address);
        var zcode = $scope.errorZipStateChange(editAuthor.ZipCode);
        var cntry = $scope.errorCntryStateChange(editAuthor.Country);


        if (Boolean(inits) == false && Boolean(fName) == false && Boolean(lName) == false && Boolean(addr) == false && Boolean(zcode) == false && Boolean(cntry) == false) {

            var msg = $scope.Message;


            AthrApi.updateAuthor(editAuthor)
              .then(function (response) {               
                 // $window.location.reload();
                  $('#editAuthorModal').modal('hide');
              }, function (error) {
                  $scope.Message = error.message;
                  $("#msgView").css('color', 'red');
              });
        }


    };
}]);

MyApp.controller("EditAuthorController", function ($scope) {
    $scope.message = "Edit Author";
});

MyApp.controller("DeleteAuthorController", ['$scope', '$location', '$window', '$routeParams', 'AthrApi', function ($scope, $location, $window, $routeParams, AthrApi) {
    $scope.message = "Delete Page with query string id :" + $routeParams.id;
    $scope.Author;

    var getId = $routeParams.id;
    getAuthor(getId);

    function getAuthor(getId) {
        AthrApi.getAuthor(getId)
            .then(function (response) {
                $scope.Author = response.data;
            }, function (error) {
                $scope.status = 'Unable to load author data: ' + error.message;
            });
    }

    $scope.deleteAuthor = function(id)
    {           
        AthrApi.deleteAuthor(id)
            .then(function (response) {
                $location.path("/Author");
            }, function (error) {
                $scope.status = 'Unable to load author data: ' + error.message;
        });
    }
   
}]);

MyApp.controller("BookController", ['$scope', '$window', '$http', 'BookApi', 'FileApi', function ($scope, $window, $http, BookApi, FileApi) {
    //$scope.PageTitle = "Book List";
    $scope.Books = [];

    $scope.Message = "";

    getBooks();

    function getBooks() {

        $scope.TotalData = [];

        BookApi.getBooks()
            .then(function (response) {
                $scope.TotalData = response.data;

                $scope.currentPage = 1;
                $scope.numPerPage = 5;
                $scope.maxSize = 5;
                $scope.totalCount = response.data.length;

                $scope.$watch('currentPage + numPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                    $scope.Books = $scope.TotalData.slice(begin, end);
                });


            }, function (error) {
                $scope.status = 'Unable to load author data: ' + error.message;
            });

    };

    $scope.file = null;
    $scope.filename = "";
      

    $scope.states = {
        clearBookForm: false,
        errorTitle: false,
        errorIsbn: false,
        errorPubDate: false,
        errorPrice: false,
        errorPubHouse: false,
        errorFile : false

    };

    $scope.new = {
        Book: {}
    };

    $scope.clearBookForm = function (show) {
        $scope.states.errorTitle = false;
        $scope.states.errorIsbn = false;
        $scope.states.errorPubDate = false;
        $scope.states.errorPrice = false;
        $scope.states.errorPubHouse = false;
        $scope.states.errorFile = false;
        $scope.Message = "";
        $scope.new.Book = {};       
        $scope.newImgUpload = null;
        $scope.file = null;
        $scope.filename = "";
        angular.element("input[type='file']").val(null);
        $("#imageFile").val('');
        $('#imageView').attr('src', '../Content/Image/icon_image.jpg');        
    };

    //Error checking
    $scope.errorTitleStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorTitle = false;
        }
        else {
            return $scope.states.errorTitle = true;
        }
    };

    $scope.errorIsbnStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorIsbn = false;
        }
        else {
            return $scope.states.errorIsbn = true;
        }
    };

    $scope.errorPubDateStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorPubDate = false;
        }
        else {
            return $scope.states.errorPubDate = true;
        }
    };

    $scope.errorPriceStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorPrice = false;
        }
        else {
            return $scope.states.errorPrice = true;
        }
    };

    $scope.errorPubHouseStateChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorPubHouse = false;
        }
        else {
            return $scope.states.errorPubHouse = true;
        }
    };

    $scope.errorFileChange = function (e) {
        if (e != null && e != "") {
            return $scope.states.errorFile = false;
        }
        else {
            return $scope.states.errorFile = true;
        }
    };

    $scope.setFile = function (element, opt) {
        $scope.$apply(function ($scope) {
            $scope.file = element.files[0];
            $scope.filename = element.value;
            $scope.errorFileChange($scope.file);
        });

        $scope.readURL(element, opt);
    };

    $scope.readURL = function (input, optVal) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (optVal == 'add') {
                    $('#imageView').attr('src', e.target.result);
                }
                else {
                    $('#editImgView').attr('src', e.target.result);
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    };


    $scope.saveBook = function () {
        var title = $scope.errorTitleStateChange($scope.new.Book.Title);
        var isbn = $scope.errorIsbnStateChange($scope.new.Book.Isbn);
        var pubdate = $scope.errorPubDateStateChange($scope.new.Book.PublishingDate);
        var price = $scope.errorPriceStateChange($scope.new.Book.Price);
        var pubhouse = $scope.errorPubHouseStateChange($scope.new.Book.Price);
        var fle = $scope.errorFileChange($scope.file);

        if (Boolean(title) == false && Boolean(isbn) == false && Boolean(pubdate) == false &&
            Boolean(price) == false && Boolean(pubhouse) == false && Boolean(fle) == false)
        {
            $scope.new.Book.BookId = 0;
           
                    var files = $scope.file;                  

                    var data = new FormData();
                    data.append('imageFile', files);                  

            FileApi.UploadImage(data)
                    .then(function (response) {

                        $scope.new.Book.Image = response.data;

                        var abook = $scope.new.Book;

                        var msg = $scope.Message;


                        BookApi.insertBook(abook)
                          .then(function (response) {
                              // $scope.Books.push($scope.new.Book);
                              $scope.new.Book = {};
                              $scope.Message = "";
                              $window.location.reload();
                              //  $('#authorModal').modal('hide');

                          }, function (error) {
                              $scope.Message = error.message;
                              $("#msgView").css('color', 'red');
                          });

                    }, function (error) {
                        $scope.status = 'Unable to load author data: ' + error.message;
                    });




          
        }

    };

    //$scope.reloadPage = function () { $window.location.reload(); }
}]);


