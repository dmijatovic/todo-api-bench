
export default (key:string, defVal:string)=>{
  let value:string|undefined = Deno.env.get(key)
  if (value){
    return value
  } else {
    console.log(`${key} NOT FOUND using default...${defVal}`)
    return defVal
  }
}