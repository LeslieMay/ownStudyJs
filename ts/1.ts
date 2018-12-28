interface person {
    firstName: string,
    lastName: string
}
class Student {
    fullname: string;
    constructor(public firstName, public middle, public lastName){
        this.fullname = firstName + " " + middle + " " + lastName
    }
}
function greeter(person: person){
    console.log('hello, ' + person.firstName + ' ' + person.lastName)
}

let user = new Student('leslie','D.','Cheung')
greeter(user)