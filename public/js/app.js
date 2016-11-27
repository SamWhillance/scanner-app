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

// Controller
app.controller("appController", ['$scope', '$log', '$timeout', 'Entries', function ($scope, $log, $timeout, Entries) {
	$scope.barcode = null;
	$scope.entries = [];
	$scope.alert = null;

	var alertTimer = null;

	$scope.getEntries = function () {
		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);
			$scope.entries = response.data;
		}, function (error) {
			$scope.setAlert("alert-danger", "Failed to get items");
		});
	};

	$scope.createEntry = function () {
		var entry = {
			barcode: $scope.barcode,
		};

		Entries.createEntry(entry).then(function (response) {
			$log.info("Entry created");
			$scope.setAlert("alert-success", "Item added");
			$scope.getEntries();
		}, function (error) {
			alert("Error creating entry.");
			$scope.setAlert("alert-danger", "Failed to add item");
		});

		$scope.barcode = "";
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
