/**
 * is_square (-1) # => false
is_square   0 # => true
is_square   3 # => false
is_square   4 # => true
is_square  25 # => true
is_square  26 # => false
 */
/**
 * 
 */
const is_square = (num) => {
    return Number.isInteger(Math.sqrt(num))
}

console.log(is_square(-1))
console.log(is_square(0))
console.log(is_square(3))
console.log(is_square(4))
console.log(is_square(25))
console.log(is_square(26))