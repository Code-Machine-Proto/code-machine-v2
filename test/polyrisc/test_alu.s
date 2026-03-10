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

ldi r20, 10
st (r20), r3
ldi r20, 11
st (r20), r4
ldi r20, 12
st (r20), r5
ldi r20, 13
st (r20), r6
ldi r20, 14
st (r20), r7
ldi r20, 15
st (r20), r8
ldi r20, 16
st (r20), r9
ldi r20, 17
st (r20), r10
stop

# === RÉSULTATS ATTENDUS ===
# mem[10] = 13      (add:  10 + 3)
# mem[11] = 7       (sub:  10 - 3)
# mem[12] = 2       (and:  10 & 3 = 0b1010 & 0b0011)
# mem[13] = 11      (or:   10 | 3 = 0b1010 | 0b0011)
# mem[14] = 10      (mv:   r1)
# mem[15] = 5       (shr:  10 >> 1)
# mem[16] = 20      (shl:  10 << 1)
# mem[17] = 0xFFFC  (not:  ~3)
