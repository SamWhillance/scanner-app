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
app.controller("appController", ['$scope', '$log', 'Entries', function ($scope, $log, Entries) {
	$scope.barcode = null;
	$scope.entries = [];
	$scope.alert = null;

	var alertTimer = null;

	$scope.getEntries = function () {
		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);
			$scope.entries = response.data;
		}, function (error) {
			$scope.setAlert("alert-danger", "Failed to get items from database");
		});
	};

	$scope.createEntry = function () {
		var entry = {
			barcode: $scope.barcode,
		};

		Entries.createEntry(entry).then(function (response) {
			$log.info("Entry created");
			$scope.setAlert("alert-success", "Item was added");
			$scope.getEntries();
		}, function (error) {
			alert("Error creating entry.");
			$scope.setAlert("alert-danger", "Failed to add item to database");
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
			clearTimeout(alertTimer);
			alertTimer = null;
		}

		alertTimer = setTimeout(function(){
			$scope.alert = null;
		}, 5000);
	}

}]);
