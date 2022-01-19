//
//
// function dec1(constructor:Function){
//     console.log(constructor)
//
// }
// function dec2(target:any, propName: string|Symbol ){
//     console.log(target)
//     console.log(propName)
// }
//
// function dec3(target:any, propName: string|Symbol, descriptor: PropertyDescriptor ){
//     console.log(target)
//     console.log(propName)
//     descriptor.writable = false;
// }
//
// @dec1
// class Component {
//     @dec2
//     private _name: string
//
//     constructor(name: string) {
//         this._name = name;
//     }
//
//     @dec3
//     get name(): string {
//         return this._name;
//     }
//
//     set name(value: string) {
//         this._name = value;
//     }
// }
//
// function logger(target: Function): Function{
//
//     let newConstructor: Function = function(name:string){
//         console.log("Creating new instance");
//
//         // @ts-ignore
//         this.name = name;
//         // @ts-ignore
//         this.age = 23;
//         // @ts-ignore
//         this.print = function():void{
//             console.log(this.name, this.age);
//         }
//     }
//     return newConstructor;
// }
//
// // @ts-ignore
// @logger
// class User {
//     name: string;
//     constructor(name: string){
//         this.name = name;
//     }
//     print():void{
//         console.log(this.name);
//     }
// }
// let tom = new User("Tom");
// let bob = new User("Bob");
// tom.print();
// bob.print();

function logParameter(target: any, key: string, index: number) {
    var metadataKey = `__log_${key}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        console.log(target)
        console.log(index)
        console.log(key)
        target[metadataKey].unshift(index);

    } else {
        console.log(target)
        console.log(index)
        console.log(key)
        target[metadataKey] = [index];
    }
    console.log(target[metadataKey][0])
    console.log(target[metadataKey][1])
}

function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {

    var originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {

        var metadataKey = `__log_${key}_parameters`;
        var indices = target[metadataKey];
        console.log(indices)

        if (Array.isArray(indices)) {
            for (var i = 0; i < args.length; i++) {

                if (indices.indexOf(i) !== -1) {
                    var arg = args[i];
                    var argStr = JSON.stringify(arg) || arg.toString();
                    console.log(`${key} arg[${i}]: ${argStr}`);
                }
            }
            var result = originalMethod.apply(this, args);
            return result;
        } else {
            var a = args.map(a => (JSON.stringify(a) || a.toString())).join();
            var result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            console.log(`Call: ${key}(${a}) => ${r}`);
            return result;
        }
    }
    return descriptor;
}

class User {

    private name: string;
    private age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    @logMethod
    setName(@logParameter name: string,  @logParameter age?: number) {
        this.name = name;
    }

    print(): void {
        console.log(this.name);
    }
}

let tom = new User("Tom", 22);
tom.setName("Bob", 22);
