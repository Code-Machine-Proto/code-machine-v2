/**
 * Les états des lignes de l'accumulateur
 */
export enum LineStateAccumulator {
    error = -1,
    fetch,
    load,
    store,
    decode,
    alu,
    nop,
    branching,
}

/**
 * Les états des lignes de l'accumulateur avec MA
 */
export enum LineStateMa {
    error = -1,
    fetch,
    decode,
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
    branching,
    nop,
}

/**
 * Les états des lignes du PolyRisc
 */
export enum LineStatePolyRisc {
    error = -1,
    fetch,
    decode,
    opTwoReg,
    opThreeReg,
    load,
    store,
    loadI,
    branching,
    nop,
}
