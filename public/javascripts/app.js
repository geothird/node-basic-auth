'use strict';

var app = angular.module('node-basic-auth', ['api', 'ngResource', 'ngCookies']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/resources', {
      templateUrl: 'partials/list.html',
      controller: 'ResourcesCtrl'
    }).
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    }).otherwise({
      redirectTo: '/'
    });
}]);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push(
    function ($rootScope, $location, $cookieStore, $q) {

      return {
        'request': function (request) {
          $rootScope.currentUser = $cookieStore.get('authdata');
          if (!$rootScope.currentUser && $location.path() != '/login') {
            $location.path('/login');
          }
          return request;
        },
        'responseError': function (rejection) {
          if (rejection.status === 401 && $location.path() != '/login') {
            if ($rootScope.currentUser) {
              $cookieStore.remove('authdata');
              $rootScope.currentUser = '';
              $rootScope.loginError = 'Error 401 Invalid username/password';
            }
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    });
});
