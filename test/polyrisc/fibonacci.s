.text
ldi r1, 0           # F(0)
ldi r2, 1           # F(1)
ldi r3, n
ld  r3, (r3)        # r3 = valeur de n
ldi r4, resultat    # r4 = adresse d'écriture

st  (r4), r1        # stocker F(0)
ldi r5, 1
add r4, r4, r5      # r4++
st  (r4), r2        # stocker F(1)
add r4, r4, r5      # r4++
ldi r6, 2
sub r3, r3, r6      # compteur -= 2

boucle:
add r7, r1, r2      # F(n) = F(n-1) + F(n-2)
st  (r4), r7
mv  r1, r2
mv  r2, r7
add r4, r4, r5      # r4++
sub r3, r3, r5      # compteur--
brnz boucle

stop

.data
n:        8
resultat: 0 0 0 0 0 0 0 0

# === RÉSULTATS ATTENDUS (n=8) ===
# mem[resultat+0] = 0
# mem[resultat+1] = 1
# mem[resultat+2] = 1
# mem[resultat+3] = 2
# mem[resultat+4] = 3
# mem[resultat+5] = 5
# mem[resultat+6] = 8
# mem[resultat+7] = 13