// maskify("4556364607935616") == "############5616"
// maskify("64607935616") ==      "#######5616"
// maskify("1") ==                "1"
// maskify("") ==                 ""

// // "What was the name of your first pet?"
// maskify("Skippy")                                   == "##ippy"
// maskify("Nananananananananananananananana Batman!") == "####################################man!"

const maskify = (str) => {
    let l = str.length;
    if(l<=4) return str
    return str.slice(l-4).padStart(l,'#')
}
console.log(maskify("4556364607935616"))
console.log(maskify("64607935616"))
console.log(maskify("1"))
console.log(maskify(""))
console.log(maskify("Skippy"))
console.log(maskify("Nananananananananananananananana Batman!"))