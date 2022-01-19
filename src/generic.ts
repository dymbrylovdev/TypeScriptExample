

// Generic types
class Collections<T>{
    private _array:T[]
    constructor(arr:T[]) {
        this._array=arr
    }

    set array(value: T[]) {
        this._array = value;
    }

    get array(): T[] {
        return this._array;
    }
}


let newArr1 = new Collections([1,2,3,4,5])

console.log(newArr1.array)