export function set_intersection(sets) {
    let output = new Set;
    sets[0].forEach((value) => {
        let is_in = true;
        for (let i = 1; i < sets.length; ++i) {
            if (!sets[i].has(value)) {
                is_in = false;
                break;
            }
        }
        if (is_in) {
            output.add(value);
        }
    });
    return output;
}
export function set_union(sets) {
    let output = new Set;
    for (let i = 0; i < sets.length; ++i) {
        sets[i].forEach((value) => { output.add(value); });
    }
    return output;
}
export function set_subtraction(original, sets) {
    const removeSets = sets.length > 1 ? set_union(sets) : sets[0];
    original.forEach((value) => {
        if (removeSets.has(value)) {
            original.delete(value);
        }
    });
    return original;
}
