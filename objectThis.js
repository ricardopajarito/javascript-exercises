// let user = {
//     name: "Jhon",
//     age: 30,
//     sayHi() {
//         console.log(user.name);
//     }
// };

// let admin = user;
// user = null;

// admin.sayHi();

//Para estos casos la propiedad this se evalua en call-time y no depende de donde el metodo fue declarado, en lugar de que objeto
//está antes del punto. Esto nos permite usar una function para diferentes objetos, esto es muy flexible pero tambien
//es crea posibilidades para cometer errores.

// let user = {name: "Jhon"};
// let admin = {name: "Admin"};

// function sayHi() {
//     console.log(this.name);
// }

// user.f = sayHi;
// admin.f = sayHi

// admin["f"](); //this === admin
// user["f"](); //this === user

// Task 1
// function makeUser() {
//     return {
//         name: "Jhon",
//         ref: this
//     };
// }

// let user = makeUser();

// console.log(user.ref.name); //undefined

// function makeUser() {
//     return {
//         name: "Jhon",
//         ref() {
//             return this;
//         }
//     };
// }

// let user = makeUser();

// console.log(user.ref().name); //Jhon

//Task 2
// let calculator = {
//     result: 0,
//     read() {
//         console.log(this.result)
//     },
//     sum(number) {
//         this.result += number;
//     },
//     mul(number) {
//         this.result *= number;
//     }
// }

// calculator.read();
// calculator.sum(5);
// calculator.mul(5);
// calculator.read();


// let ladder = {
//     step: 0,
//     up() {
//       this.step++;
//       return this;
//     },
//     down() {
//       this.step--;
//       return this;
//     },
//     showStep: function() { // shows the current step
//       console.log( this.step );
//       return this;
//     }
// };

// ladder.up().up().down().showStep().down().showStep();

//Type conversions

let obj = {
    hola: 45,
    valueOf() {
        return this.hola
    }
}

console.log(obj + 5);