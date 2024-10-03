/*
function abc(){
  let name = "yash";
  let inc = 1;
  return function xyz(){
    console.log(name);
    inc++;
    return function increment(){
      console.log("value : ",this.inc);
    }
  }
}
let res = abc();
let ans = res();
ans();
*/

let age = 20, salary = 500;
const data = age > 18 ?
                      salary > 10000 ? 
                                     "i am very good rn" : "i am broke" : 
                      "i am underage";
console.log(data);