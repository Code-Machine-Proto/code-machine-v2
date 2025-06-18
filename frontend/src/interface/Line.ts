export enum LineStateAccumulator {
    error = -1,
    fetch,
    load,
    store,
    control,
    add_mul,
    nop,
    branching,
    pc,
}