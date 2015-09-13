var categoriesModule = angular.module("categoriesModule", ["helperModule", "productsModule", 'ui.bootstrap', "ngSanitize"]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.constant('config', {
  responses: {
    "error": "There was a network error. Try again later.",
    "success": {
      "create": "Your category has been created!",
      "update": "Your category has been updated!"
    }
  }
});
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.controller("viewCategoriesController",
  ["$scope", "$timeout", "$log", "$modal","helperService", "categoriesService",
    function ($scope, $timeout, $log, $modal, helperService, categoriesService) {

      $scope.getCategories = function () {
        $scope.categories = categoriesService.http.getCategories().then(function (res) {
          $scope.categories = res.data.categories;
        });
      };

      $scope.newCategory = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/admin/categories/new",
          controller: "newCategoriesController"
        });
        modalInstance.result.then(function (category) {
          $scope.categories.push(category);
        });
      };

      $scope.editCategory = function (id, index) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/admin/categories/" + id + "/edit",
          controller: "editCategoriesController"
        });
        modalInstance.result.then(function (category) {
          $scope.categories[index] = category;
        });
      };

      $scope.removeCategory = function (id, index) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/dialogs/confirmDeleteCategory.html",
          controller: "deleteProductsController"
        });
        modalInstance.result.then(function () {
          categoriesService.http.removeCategory(id).then(function () {
            $scope.categories.splice(index, 1);
          })
        });
      };
      // Initialization
      $scope.getCategories();
    }]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.controller("showCategoriesController",
  ["$scope", "$timeout", "$log", "$location", "config", "$modal", "helperService", "productsService", "categoriesService",
    function ($scope, $timeout, $log, $location, config, $modal, helperService, productsService, categoriesService) {

      var segments = $location.absUrl().split("/");
      var id = segments[segments.length - 1];

      categoriesService.http.getCategory(id).then(function (res) {
        $scope.category = res.data.category;
      });

      $scope.newProduct = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/admin/products/new",
          controller: "newProductsController"
        });
        modalInstance.result.then(function (product) {
          $scope.category.products.push(product);
        });
      };

      $scope.editProduct = function (id, index) {
        helperService.storage.product_id = id;
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/admin/products/" + id + "/edit",
          controller: "editProductsController"
        });
        modalInstance.result.then(function (product) {
          $scope.category.products[index] = product;
        });
      };

      $scope.removeProduct = function(id, index) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/dialogs/confirmDeleteProduct.html",
          controller: "deleteProductsController"
        });
        modalInstance.result.then(function () {
          productsService.removeProduct(id).then(function() {
            $scope.category.products.splice(index);
          })
        });
      }
    }]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.controller("editCategoriesController",
  ["$scope", "$timeout", "$log", "$location", "$modalInstance", "config", "categoriesService",
    function ($scope, $timeout, $log, $location, $modalInstance, config, categoriesService) {
      $scope.save = function (form, id) {
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }
        categoriesService.http.updateCategory(id, $scope.category)
          .success(function (data) {
            $modalInstance.close(data.category);
            $scope.messages = config.responses.success.update;
            $scope.submitted = false;
            $log.info(data);
          })
          .error(function (data) {
            $scope.messages = config.responses.error;
            $log.error(data);
          })
          .finally(function () {
            $timeout(function () {
              $scope.messages = null;
            }, 3000);
          })
      };
      $scope.cancel = function () {
        $modalInstance.dismiss();
      };
    }]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.controller("newCategoriesController",
  ["$scope", "$timeout", "$log", "config", "$modalInstance", "categoriesService",
    function ($scope, $timeout, $log, config, $modalInstance, categoriesService) {
      $scope.save = function (form) {
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }
        categoriesService.http.newCategory($scope.category)
          .success(function (data) {
            $scope.category = {};
            $scope.messages = config.responses.success.create;
            $scope.submitted = false;
            $modalInstance.close(data.category);
            $log.info(data);
          })
          .error(function (data) {
            $scope.messages = config.responses.error;
            $log.error(data);
          })
          .finally(function () {
            $timeout(function () {
              $scope.messages = null;
            }, 3000);
          })
      };
      $scope.cancel = function () {
        $modalInstance.dismiss();
      };
    }]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.controller("deleteCategoriesController",["$scope", function($scope) {
  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.factory("categoriesService", ["$http", function ($http) {
  var path = "/admin/categories/";
  return {
    http: {
      getCategory: function (id) {
        return $http.get(path + id)
      },
      newCategory: function (category) {
        return $http.post(path, category);
      },
      updateCategory: function (id, category) {
        return $http.put(path + id, category);
      },
      removeCategory: function (id) {
        return $http.delete(path + id);
      },
      getCategories: function () {
        return $http.get(path);
      }
    }
  }
}]);
//----------------------------------------------------------------------------------------------------------------------
categoriesModule.run(["$templateCache", function($templateCache) {
  $templateCache.put("/dialogs/confirmDeleteProduct.html",
    '<div class="modal-header"><div class="modal-title">Delete</div></div>' +
    '<div class="modal-body">Do you really want to delete this product ?' +
    '</div><div class="modal-footer"><button type="button" ng-click="ok()" class="btn btn-primary">OK</button>' +
    '<button type="button" ng-click="cancel()" class="btn btn-warning">Cancel</button></div>');
  $templateCache.put("/dialogs/confirmDeleteCategory.html",
    '<div class="modal-header"><div class="modal-title">Delete</div></div>' +
    '<div class="modal-body">Do you really want to delete this category ?' +
    '</div><div class="modal-footer"><button type="button" ng-click="ok()" class="btn btn-primary">OK</button>' +
    '<button type="button" ng-click="cancel()" class="btn btn-warning">Cancel</button></div>')
}]);