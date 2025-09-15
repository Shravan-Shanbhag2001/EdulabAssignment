class Person{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }

    greet(){
        console.log("Hi "+this.name+" "+this.age);
    }
}

module.exports=Person;
