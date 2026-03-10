.text
ldi r5, 0        # r5 = adresse de n (mem[0])
ld  r0, (r5)     # r0 = 4 (compteur, décrémenté à chaque tour)
ldi r1, 0        # r1 = accumulateur somme
ldi r2, 1        # r2 = constante 1
ldi r3, 2        # r3 = constante 2
ldi r4, 2        # r4 = nombre pair courant (2, 4, 6, 8...)
boucle:
add r1, r1, r4   # somme += r4   (2, 6, 12, 20)
add r4, r4, r3   # r4 += 2       (4, 6, 8, 10)
sub r0, r0, r2   # compteur--    (3, 2, 1, 0)
brz fin          # si r0==0, sortir
br boucle
fin:
add r5, r5, r2   # r5 = 1 (adresse de somme)
st (r5), r1      # mem[1] = 20
stop
.data
n: 4
somme: 0

# === RÉSULTATS ATTENDUS ===
# mem[0] = 4    (n, inchangé)
# mem[1] = 20   (2+4+6+8)