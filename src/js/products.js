var productsModule = angular.module("productsModule", ["helperModule","categoriesModule","ui.bootstrap"]);
//----------------------------------------------------------------------------------------------------------------------
productsModule.constant('config', {
  responses: {
    "error": "There was a network error. Try again later.",
    "success": {
      "create": "Your product has been created!",
      "update": "Your product has been updated!"
    }
  }
});
//----------------------------------------------------------------------------------------------------------------------
productsModule.controller("newProductsController",
  ["$scope", "$timeout", "$log", "$modalInstance", "config", "categoriesService", "productsService",
    function ($scope, $timeout, $log, $modalInstance, config, categoriesService, productsService) {

      categoriesService.http.getCategories().then(function (res) {
        $scope.categories = res.data.categories;
      });

      $scope.save = function (form) {
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }
        productsService.newProduct($scope.product)
          .success(function (data) {
            $scope.product = {};
            $scope.messages = config.responses.success.create;
            $scope.submitted = false;
            $modalInstance.close(data.product);
            $log.info(data);
          })
          .error(function (data) {
            $scope.messages = config.responses.error;
            $log.error(data);
          })
          .finally(function (data) {
            $timeout(function () {
              $scope.messages = null;
              console.log(data);
            }, 3000);
          })
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }]);
//----------------------------------------------------------------------------------------------------------------------
productsModule.controller("editProductsController",
  ["$scope", "$timeout", "$log", "$modalInstance", "$location", "config","helperService", "categoriesService", "productsService",
    function ($scope, $timeout, $log, $modalInstance, $location, config, helperService, categoriesService, productsService) {

      productsService.getProduct(helperService.storage.product_id).then(function (res) {
        $scope.product = res.data.product;
        $scope.product.category = res.data.product._category._id;
      });

      categoriesService.http.getCategories().then(function(res) {
        $scope.categories = res.data.categories;
      });

      $scope.save = function (form, id) {
        console.log($scope.product);
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }

        productsService.updateProduct(id, $scope.product)
          .success(function (data) {
            $scope.product = {};
            $scope.messages = config.responses.success.update;
            $scope.submitted = false;
            console.log(data);
            $modalInstance.close(data.product);
            $log.info(data);
          })
          .error(function (data) {
            $scope.messages = 'There was a network error. Try again later.';
            $log.error(data);
          })
          .finally(function () {
            $timeout(function () {
              $scope.messages = null;
            }, 3000);
          })
      };

      $scope.cancel = function () {
        console.log($scope.product);
        $modalInstance.dismiss('canceled');
      };

    }]);
//----------------------------------------------------------------------------------------------------------------------
productsModule.controller("showProductsController", ["$scope", "$timeout", "$log", "$location","productsService",
  function ($scope, $timeout, $log, $location, productsService) {
    var segments = $location.absUrl().split("/");
    var id = segments[segments.length - 1];

    productsService.getProduct(id).then(function (res) {
      $scope.product = res.data.product;
    });
  }]);
//----------------------------------------------------------------------------------------------------------------------
productsModule.controller("deleteProductsController", ["$scope","$modalInstance", function($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}]);
//----------------------------------------------------------------------------------------------------------------------
productsModule.factory("productsService", ["$http", function ($http) {
  var path = "/admin/products/";
  return {
    getProduct: function (id) {
      return $http.get(path + id)
    },
    newProduct: function (product) {
      return $http.post('/admin/products', product);
    },
    removeProduct: function (id) {
      return $http.delete("/admin/products/" + id);
    },
    updateProduct: function (id, product) {
      return $http.put("/admin/products/" + id, product)
    }
  }
}]);


