.text
ldi r8, 1           # constante 1
ldi r1, n
ld  r1, (r1)        # r1 = n
ldi r9, table       # r9 = adresse base
mv  r2, r1
sub r2, r2, r8      # r2 = n-1 (passes restantes)

loop_outer:
brz done
mv  r4, r9          # r4 = adresse courante
mv  r3, r2          # r3 = compteur interne

loop_inner:
ld  r5, (r4)        # r5 = table[i]
mv  r10, r4
add r10, r10, r8    # r10 = adresse i+1
ld  r6, (r10)       # r6 = table[i+1]

sub r7, r5, r6      # r5 - r6
brlz no_swap        # r5 < r6, pas de swap (si egal : swap sans consequence)
st  (r4), r6
st  (r10), r5

no_swap:
add r4, r4, r8      # r4++
sub r3, r3, r8      # compteur interne--
brnz loop_inner

sub r2, r2, r8      # passes restantes--
br loop_outer

done:
stop

.data
n:     8
table: 64 25 12 22 11 90 43 7

# === RÉSULTATS ATTENDUS ===
# table[0] =  7
# table[1] = 11
# table[2] = 12
# table[3] = 22
# table[4] = 25
# table[5] = 43
# table[6] = 64
# table[7] = 90