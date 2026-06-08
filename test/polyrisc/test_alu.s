.text
ldi r1, 10
ldi r2, 3

add  r3, r1, r2    # r3 = 10 + 3
sub  r4, r1, r2    # r4 = 10 - 3
and  r5, r1, r2    # r5 = 10 & 3
or   r6, r1, r2    # r6 = 10 | 3
mv   r7, r1        # r7 = r1
shr  r8, r1        # r8 = 10 >> 1
shl  r9, r1        # r9 = 10 << 1
not  r10, r2       # r10 = ~3

ldi r20, res_add
st (r20), r3
ldi r20, res_sub
st (r20), r4
ldi r20, res_and
st (r20), r5
ldi r20, res_or
st (r20), r6
ldi r20, res_mv
st (r20), r7
ldi r20, res_shr
st (r20), r8
ldi r20, res_shl
st (r20), r9
ldi r20, res_not
st (r20), r10
stop

.data
res_add: 0
res_sub: 0
res_and: 0
res_or:  0
res_mv:  0
res_shr: 0
res_shl: 0
res_not: 0

# === RÉSULTATS ATTENDUS ===
# mem[res_add] = 13     (add:  10 + 3)
# mem[res_sub] = 7      (sub:  10 - 3)
# mem[res_and] = 2      (and:  10 & 3 = 0b1010 & 0b0011)
# mem[res_or]  = 11     (or:   10 | 3 = 0b1010 | 0b0011)
# mem[res_mv]  = 10     (mv:   r1)
# mem[res_shr] = 5      (shr:  10 >> 1)
# mem[res_shl] = 20     (shl:  10 << 1)
# mem[res_not] = -4     (not:  ~3 = 0xFFFC)
