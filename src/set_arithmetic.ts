export function set_intersection(sets:Set<number>[]) {
    let output:Set<number> = new Set<number>;
    sets[0].forEach((value:number) => {
        let is_in:boolean = true;
        for(let i = 1; i < sets.length; ++i) {
            if(!sets[i].has(value)) {
                is_in = false;
                break;
            }
        }
        if(is_in) {output.add(value);}
    });
    return output;
}

export function set_union(sets:Set<number>[]) {
    let output:Set<number> = new Set<number>;
    for(let i = 0; i < sets.length; ++i) {
        sets[i].forEach((value:number) => {output.add(value)});
    }
    return output;
}

export function set_subtraction(original:Set<number>, sets:Set<number>[]) {
    const removeSets:Set<number> = sets.length > 1 ? set_union(sets) : sets[0];
    original.forEach((value:number) => {
        if(removeSets.has(value)) {
            original.delete(value);
        }
    });
    return original;
}