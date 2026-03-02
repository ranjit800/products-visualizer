const parent = () =>{
  let a = 10;
  const child = ()=>{
    a++
    return a;
  }
}

parent();
child();