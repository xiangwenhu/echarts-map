export function delay(duration: number = 100){
    return new Promise((resolve , reject)=>{
        setTimeout(resolve, duration)
    })
}
