/**
 * Les états des lignes de l'accumulateur
 */
export enum LineStateAccumulator {
    error = -1,
    fetch,
    load,
    store,
    control,
    addMul,
    nop,
    branching,
    pc,
}

/**
 * Les états des lignes de l'accumulateur avec MA
 */
export enum LineStateMa {
    error = -1,
    fetch,
    control,
    branching,
    pc,
    addSubMul,
    addSubA,
    addSubX,
    sh,
    store,
    load,
    loadA,
    loadI,
    storeA,
    storeI,
    nop,
}

/**
 * Les états des lignes du PolyRisc
 */
export enum LineStatePolyRisc {
    error = -1,
    fetch,
    opTwoReg,
    opThreeReg,
    control,
    branching,
    load,
    store,
    loadI,
    pc,
    nop,
}
