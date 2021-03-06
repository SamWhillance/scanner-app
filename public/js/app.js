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
app.controller("appController", ['$scope', '$log', '$timeout', '$interval', 'Entries', function ($scope, $log, $timeout, $interval, Entries) {
	$scope.barcode = null;
	$scope.entries = [];
	$scope.alert = null;
	$scope.loading = false;

	var alertTimer = null;

	$interval(function() {
		$scope.getEntries();
	}, 1000*60*5);

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
