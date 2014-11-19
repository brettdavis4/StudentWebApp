var app = angular.module('studentApp', []);

app.service('studentService', function ($http) {
    //get all students
    this.getstudents = function () {
        return $http.get("/api/students");
    };

    //get individual student
    this.get = function (StudentID) {
        return $http.get("/api/students/" + StudentID);
    };

    //add new student
    this.post = function (Student) {
        var request = $http({
            method: "post",
            url: "/api/students",
            data: Student
        });
        return request;
    };

    //update student
    this.put = function (Student) {
        var request = $http({
            method: "put",
            url: "/api/students/" + Student.StudentID,
            data: Student
        });
        return request;
    };
    
    //delete student
    this.delete = function (StudentID) {
        var request = $http({
            method: "delete",
            url: "/api/students/" + StudentID
        });
        return request;
    };
    
});

app.controller('studentController', function ($scope, studentService) {
    $scope.editMode = false;
    
    //load student records
    loadrecords(); 
     
    function loadrecords() {
        var promiseGet = studentService.getstudents();

        promiseGet.then(function (pl) { $scope.students = pl.data },
              function (errorPl) {
                  $scope.error = "An Error has occured retreiving student data!";
                  console.log('Failure Loading Students: ', errorPl);
              });
    }
        
    //add new student button click
    $scope.add = function () {
        var newStudent = {
            FirstName: $scope.student.firstname,
            LastName: $scope.student.lastname,
            Major: $scope.student.major
        };

        var promisePost = studentService.post(newStudent);
        promisePost.then(function (pl) {
            $scope.StudentID = pl.data.StudentID;
            loadrecords();
            $('#studentModel').modal('hide');
        }, function (err) {
            $scope.error = "An Error has occured inserting student!";
            console.log("Inserting Error: " + err);
        });
    };

    //edit student button click
    $scope.edit = function () {
        
        $scope.student = this.student;
        $scope.student.firstname = this.student.FirstName;
        $scope.student.lastname = this.student.LastName;
        $scope.student.major = this.student.Major;
        $scope.student.studentID = this.student.StudentID;

        $scope.editMode = true;
        $('#studentModel').modal('show');
    };

    //update student button click
    $scope.update = function () {
        var updateStudent = {
            StudentID: $scope.student.studentID,
            FirstName: $scope.student.firstname,
            LastName: $scope.student.lastname,
            Major: $scope.student.major
        };

        var promisePut = studentService.put(updateStudent);
        promisePut.then(function (pl) {
            $scope.studentID = pl.data.StudentID;
            loadrecords();
            $('#studentModel').modal('hide');
        }, function (err) {
            $scope.error = "An Error has occured updating student!";
            console.log("Updating Error: " + err);
        });
    };

    //delete student button click
    $scope.delete = function () {
        studentService.delete($scope.student.StudentID).success(function (data) {
            $('#confirmModal').modal('hide');
            $scope.students.pop($scope.student);
        }).error(function (data) {
            $scope.error = "An Error has occured deleting student!";
            console.log("Deleting error: " + data.ExceptionMessage);
            $('#confirmModal').modal('hide');
        });
    };
    
    //Model popup events
    $scope.showadd = function () {
        $scope.student = null;
        $scope.editMode = false;
        $('#studentModel').modal('show');
    };

    $scope.showedit = function () {
        $('#studentModel').modal('show');
    };

    $scope.showconfirm = function (data) {
        $scope.student = data;
        $('#delusername').html($scope.student.FirstName + ' ' + $scope.student.LastName);
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.student = null;
        $('#studentModel').modal('hide');
    };
});