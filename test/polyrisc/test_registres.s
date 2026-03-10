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
ldi r31, resultats
st  (r31), r0        # sauver r0=200 en premier
ldi r0, 1            # r0 devient constante 1
add r31, r31, r0
st  (r31), r1
add r31, r31, r0
st  (r31), r2
add r31, r31, r0
st  (r31), r3
add r31, r31, r0
st  (r31), r4
add r31, r31, r0
st  (r31), r5
add r31, r31, r0
st  (r31), r6
add r31, r31, r0
st  (r31), r7
add r31, r31, r0
st  (r31), r8
add r31, r31, r0
st  (r31), r9
add r31, r31, r0
st  (r31), r10
add r31, r31, r0
st  (r31), r11
add r31, r31, r0
st  (r31), r12
add r31, r31, r0
st  (r31), r13
add r31, r31, r0
st  (r31), r14
add r31, r31, r0
st  (r31), r15
add r31, r31, r0
st  (r31), r16
add r31, r31, r0
st  (r31), r17
add r31, r31, r0
st  (r31), r18
add r31, r31, r0
st  (r31), r19
add r31, r31, r0
st  (r31), r20
add r31, r31, r0
st  (r31), r21
add r31, r31, r0
st  (r31), r22
add r31, r31, r0
st  (r31), r23
add r31, r31, r0
st  (r31), r24
add r31, r31, r0
st  (r31), r25
add r31, r31, r0
st  (r31), r26
add r31, r31, r0
st  (r31), r27
add r31, r31, r0
st  (r31), r28
add r31, r31, r0
st  (r31), r29
add r31, r31, r0
st  (r31), r30
add r31, r31, r0     # r31 = resultats+31
mv  r0, r31          # r0 = adresse resultats+31
ldi r31, 231         # r31 = valeur à sauver
st  (r0), r31
stop
.data
resultats: 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
# === RÉSULTATS ATTENDUS ===
# mem[resultats+i] = 200+i   pour i = 0 à 31