// 写一个函数floor_power_of2，求比x小的最大二的整数次幂。

// 例如

// floor_power_of2(64) // 64
// floor_power_of2(63) // 32
// floor_power_of2(33) // 32
// floor_power_of2(32) // 32

const floor_power_of2 = (num) => {
    let r = num.toString(2);
    return 1<<(r.length-1)
}

console.log(floor_power_of2(64))
console.log(floor_power_of2(63))
console.log(floor_power_of2(33))
console.log(floor_power_of2(32))