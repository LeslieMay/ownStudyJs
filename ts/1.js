var Student = /** @class */ (function () {
    function Student(firstName, middle, lastName) {
        this.firstName = firstName;
        this.middle = middle;
        this.lastName = lastName;
        this.fullname = firstName + " " + middle + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    console.log('hello, ' + person.firstName + ' ' + person.lastName);
}
var user = new Student('leslie', 'D.', 'Cheung');
greeter(user);
