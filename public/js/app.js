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

	$scope.getEntries = function () {
		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);
			$scope.entries = response.data;
		}, function (error) {
			alert("Error getting entries.");
		});
	};

	$scope.createEntry = function () {
		var entry = {
			barcode: $scope.barcode,
		};

		Entries.createEntry(entry).then(function (response) {
			$log.info("Entry created");
			$scope.getEntries();
		}, function (error) {
			alert("Error creating entry.");
		});
	};

}]);
