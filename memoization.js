//Utiliza clousures, funcion que devuelve una funcion, al asignarse a una variable
//esta se convierte en una función, los clousures guardan estados

const memoization = (fn) => {
    let results = {}

    return (arg) => {
        if (!results[arg]) {
            console.log("Valor no guardado");
            results[arg] = fn(arg);
        } else {
            console.log("Valor ya guardado")
        }

        return results[arg];
    }

}

const resultado = memoization(a => a*2);

console.log(resultado(1))
console.log(resultado(1))
console.log(resultado(1))
console.log(resultado(1))