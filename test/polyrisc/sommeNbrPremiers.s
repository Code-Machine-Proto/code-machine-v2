.text
ldi r5, n
ld  r0, (r5)     # r0 = n (compteur)

ldi r1, 0        # r1 = accumulateur somme
ldi r2, 1        # r2 = constante 1
ldi r3, 2        # r3 = constante 2
ldi r4, 2        # r4 = nombre pair courant (2, 4, 6, 8...)
boucle:
add r1, r1, r4   # somme += r4
add r4, r4, r3   # r4 += 2
sub r0, r0, r2   # compteur--
brz fin
br boucle
fin:
ldi r5, somme
st (r5), r1
stop

.data
n:    4
somme: 0

# === RÉSULTATS ATTENDUS ===
# mem[n]    = 4    
# mem[somme] = 20  (2+4+6+8)