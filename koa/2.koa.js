let app = {
    middlewares: [],
    use(fn){
        this.middlewares.push(fn)
    }
}

app.use((next)=>{
    console.log(1);
    next();
    console.log(6)
})
app.use((next)=>{
    console.log(2);
    next();
    console.log(5)
})
app.use((next)=>{
    console.log(3);
    typeof next ==='function' && next();
    console.log(4)
})


// function dispatch(index) {
//     if(index === app.middlewares.length)return;
//     let fn = app.middlewares[index];
//     fn(()=>dispatch(index+1))
// }
// dispatch(0)

let fn = app.middlewares.reduce((a,b)=>(...arg)=>{a(()=>b(...arg))})
fn();