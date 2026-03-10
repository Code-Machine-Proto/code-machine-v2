.text
# Charger une valeur distincte dans chaque registre (r0-r30)
ldi r0,  200
ldi r1,  201
ldi r2,  202
ldi r3,  203
ldi r4,  204
ldi r5,  205
ldi r6,  206
ldi r7,  207
ldi r8,  208
ldi r9,  209
ldi r10, 210
ldi r11, 211
ldi r12, 212
ldi r13, 213
ldi r14, 214
ldi r15, 215
ldi r16, 216
ldi r17, 217
ldi r18, 218
ldi r19, 219
ldi r20, 220
ldi r21, 221
ldi r22, 222
ldi r23, 223
ldi r24, 224
ldi r25, 225
ldi r26, 226
ldi r27, 227
ldi r28, 228
ldi r29, 229
ldi r30, 230

# Sauvegarder r0-r30 en memoire (r31 utilise comme adresse scratch)
ldi r31, 0
st (r31), r0
ldi r31, 1
st (r31), r1
ldi r31, 2
st (r31), r2
ldi r31, 3
st (r31), r3
ldi r31, 4
st (r31), r4
ldi r31, 5
st (r31), r5
ldi r31, 6
st (r31), r6
ldi r31, 7
st (r31), r7
ldi r31, 8
st (r31), r8
ldi r31, 9
st (r31), r9
ldi r31, 10
st (r31), r10
ldi r31, 11
st (r31), r11
ldi r31, 12
st (r31), r12
ldi r31, 13
st (r31), r13
ldi r31, 14
st (r31), r14
ldi r31, 15
st (r31), r15
ldi r31, 16
st (r31), r16
ldi r31, 17
st (r31), r17
ldi r31, 18
st (r31), r18
ldi r31, 19
st (r31), r19
ldi r31, 20
st (r31), r20
ldi r31, 21
st (r31), r21
ldi r31, 22
st (r31), r22
ldi r31, 23
st (r31), r23
ldi r31, 24
st (r31), r24
ldi r31, 25
st (r31), r25
ldi r31, 26
st (r31), r26
ldi r31, 27
st (r31), r27
ldi r31, 28
st (r31), r28
ldi r31, 29
st (r31), r29
ldi r31, 30
st (r31), r30

# r31 : charge sa valeur de test, utilise r30 comme adresse
# (r30 est deja sauvegarde en mem[30])
ldi r31, 231
ldi r30, 31
st (r30), r31

stop

# === RÉSULTATS ATTENDUS ===
# mem[i] = 200+i   pour i = 0 a 30
# mem[31] = 231    (r31)
#
# mem[0]  = 200    mem[8]  = 208    mem[16] = 216    mem[24] = 224
# mem[1]  = 201    mem[9]  = 209    mem[17] = 217    mem[25] = 225
# mem[2]  = 202    mem[10] = 210    mem[18] = 218    mem[26] = 226
# mem[3]  = 203    mem[11] = 211    mem[19] = 219    mem[27] = 227
# mem[4]  = 204    mem[12] = 212    mem[20] = 220    mem[28] = 228
# mem[5]  = 205    mem[13] = 213    mem[21] = 221    mem[29] = 229
# mem[6]  = 206    mem[14] = 214    mem[22] = 222    mem[30] = 230
# mem[7]  = 207    mem[15] = 215    mem[23] = 223    mem[31] = 231
