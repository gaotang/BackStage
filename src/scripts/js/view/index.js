require(['angular', 'bootStrap', 'controllers/index/serverCtrl', 'controllers/index/customListCtrl', 'controllers/index/groupCtrl', 'controllers/index/consultStatisticCtrl', 'controllers/index/usuallyCtrl', 'controllers/index/groupEditCtrl', 'controllers/index/messageCtrl', 'controllers/index/messageStatisticCtrl', 'controllers/index/journaledCtrl'
  , 'controllers/index/questionLibraryCtrl'
  , 'controllers/index/questionDetailCtrl'
  , 'controllers/index/questionManagementCtrl'
  , 'controllers/index/questionStatisticCtrl'
  , 'controllers/index/homeCtrl'
  , 'controllers/index/userManagementCtrl'
],
  function (angular) {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["indexApp"]);
    })
  });
