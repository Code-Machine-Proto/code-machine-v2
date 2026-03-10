.text
ldi r1, 0           # somme
ldi r2, 1           # constante 1
ldi r3, 10          # compteur
ldi r4, tablenbr    # r4 = adresse de tablenbr

boucle:
ld  r5, (r4)        # r5 = mem[r4]
add r1, r1, r5      # somme += r5
add r4, r4, r2      # r4++
sub r3, r3, r2      # compteur--
brnz boucle

ldi r4, resultat
st  (r4), r1        # mem[resultat] = somme
stop

.data
tablenbr: 3 7 2 8 5 1 9 4 6 10
resultat: 0

# === RÉSULTATS ATTENDUS ===
# mem[resultat] = 55   (3+7+2+8+5+1+9+4+6+10)