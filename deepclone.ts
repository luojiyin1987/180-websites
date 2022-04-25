function deepClone(obj: any ): any {
    const map = new WeakMap();

    function isObject(obj: any):boolean {
         return (typeof obj === 'object' && obj !== null) || (typeof obj === 'function') ;
    }

    function clone(data: any):any {
        if(!isObject(data)) {
            return data;
        }

        if(typeof data ===`symbol`) {
            return Symbol.for(data.description);
        }

        if([Date, RegExp].includes(data.constructor)) {
            return new data.constructor(data);
        }

        if(typeof data === 'function') {
            return new Function('return ' + data.toString())();
        }

        const exist = map.get(data);

        if(exist) {
            return exist;
        }

        if (data instanceof Map) {
            const result = new Map();
            map.set(data, result);
            data.forEach((val, key)  => {
                if(isObject(val)) {
                    result.set(val, clone(val));
                } else {
                    result.set(key, val)
                }
            })
            return result;
        }

        const keys = Reflect.ownKeys(data);
        const allDesc = Object.getOwnPropertyDescriptors(data);
        const result = Object.create(Object.getPrototypeOf(data),allDesc);
        map.set(data,result)
        keys.forEach(key => {
            const val = data[key];
            if(isObject(val)) {
                result[key] = clone(val);
            } else {
                result[key] = val;
            }
        })
        return result;
    }

    return clone(obj);
}

