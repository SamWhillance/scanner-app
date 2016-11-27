var app = angular.module("myApp", []);

// Service
app.service("Entries", function ($http) {
	this.getEntries = function () {
		return $http.get("/entries");
	}
	this.createEntry = function (entry) {
		return $http.post("/entries", entry);
	}
});

app.directive('inputFocusFunction', function () {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			scope[attr.inputFocusFunction] = function () {
				element[0].focus();
			};
		}
	};
});

// Controller
app.controller("appController", ['$scope', '$log', '$timeout', 'Entries', function ($scope, $log, $timeout, Entries) {
	$scope.barcode = null;
	$scope.entries = [];
	$scope.alert = null;
	$scope.loading = false;

	var alertTimer = null;

	$scope.getEntries = function () {
		$scope.loading = true;

		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);
			$scope.entries = response.data;
		}, function (error) {
			$scope.setAlert("alert-danger", "Failed to get items");
			$log.error(error);
		}).finally(function(){
			$scope.loading = false;
		});
	};

	$scope.createEntry = function () {
		$scope.loading = true;

		var entry = {
			barcode: $scope.barcode,
		};

		var exists = false;
		angular.forEach($scope.entries, function(entry){
			if (entry.barcode == $scope.barcode){
				exists = true;
			}
		});

		Entries.createEntry(entry).then(function (response) {
			if (exists){
				$scope.setAlert("alert-success", entry.barcode + " was removed");
			} else {
				$scope.setAlert("alert-success", entry.barcode + " added");
			}

			$scope.getEntries();

			$scope.barcode = "";
		}, function (error) {
			$log.error("Error creating entry", error);
			$scope.setAlert("alert-danger", "Failed to add item");
			$scope.loading = false;
		});
	};

	$scope.setAlert = function(aClass, aMessage){
		$scope.alert = {
			class: aClass,
			message: aMessage
		};

		alertEndLife();
	};

	function alertEndLife(){
		if (alertTimer){
			$timeout.cancel(alertTimer);
			alertTimer = null;
		}

		alertTimer = $timeout(function(){
			$scope.alert = null;
		}, 5000);
	}

}]);
