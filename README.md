## Node.js Example Basic Authentication
Using Node.js, Express, and Angular to password protect a RESTful resource with basic header
authentication.

## Passport-http
[Passport-http]() had to be modified to prevent WWW-Authenticate headers from being returned otherwise users would see a browser based login window popup every time they recieve a 401 error.

The needed change was made on this fork [gt-passport-http]() this adds a new parameter which allows a user to specify if they want the WWW-Authenticate headers returned or not.

## Basic usage
**Server:**
```javascript
	passport.use(new BasicStrategy({ disableBasicChallenge: true },
	  function (userid, password, done) {
	    var user = users[userid];
	    if (!user) {
	      return done(null, false);
	    }
	    if (password != user.password) {
	      return done(null, false);
	    }
	    return done(null, user);
	  }
	));
```
The attribute disableBasicChallenge turns basic WWW-Authnticate headers off.

**Protecting a resource:**
```javascript
app.get('/api/v1/resources',
  passport.authenticate('basic', { session: false }),
  resources.list
);
```

**Angular App:**
```javascript
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
```
When recieving a 401 error invalidate the cookie and user object and show an error message. Otherwise if its a success return the request.

**Angular Services:**
```javascript
api.factory('Auth', ['Base64', '$cookieStore', '$http',
  function (Base64, $cookieStore, $http) {
    $http.defaults.headers.common['Authorization'] =
      'Basic ' + $cookieStore.get('authdata');
    return {
      login: function (user) {
        var encoded = Base64.encode(user.username + ':' + user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        $cookieStore.put('authdata', encoded);
      },
      logout: function () {
        document.execCommand("ClearAuthenticationCache");
        $cookieStore.remove('authdata');
        $http.defaults.headers.common.Authorization = 'Basic ';
      }
    };
  }]);
```
Service which uses Base64 to set the authentication header for subsequent requests, or on logout removes them.

**Angular Controller:**
```javascript
$scope.loginUser = function () {
    // Do basic authentication
    Auth.login($scope.user);
    $rootScope.currentUser = $scope.user.username;
    $location.path('resources');
  };
  $scope.logoutUser = function () {
    Auth.logout();
    $location.path('login');
  }
```
Using these methods you can call login/logout from buttons etc.
