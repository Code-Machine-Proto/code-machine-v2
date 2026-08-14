.text

# ===================================================================
# TEST DE VALIDATION - ARCHITECTURE POLYRISC
# 17 instructions testées : 16 avec drapeau (e1-e16), stop implicite
# resultat = 1 (succès total) ou 0 (au moins 1 échec)
# pass     = nombre de tests réussis (sur 16)
# fail     = nombre de tests échoués (sur 16)
#
# Conventions : r8 = constante 1 (fixe pour tout le programme)
#               r9 = registre scratch, réutilisé pour calculer des adresses
# ===================================================================

ldi r8, 1

# --- Test 1 : ldi ---
ldi r1, 42
ldi r2, 42
sub r3, r1, r2
brz pass1
ldi r9, e1
st (r9), r8
pass1:

# --- Test 2 : add ---
ldi r1, 5
ldi r2, 3
add r3, r1, r2
ldi r4, 8
sub r5, r3, r4
brz pass2
ldi r9, e2
st (r9), r8
pass2:

# --- Test 3 : sub ---
ldi r1, 10
ldi r2, 3
sub r3, r1, r2
ldi r4, 7
sub r5, r3, r4
brz pass3
ldi r9, e3
st (r9), r8
pass3:

# --- Test 4 : and ---
ldi r1, 12
ldi r2, 10
and r3, r1, r2
ldi r4, 8
sub r5, r3, r4
brz pass4
ldi r9, e4
st (r9), r8
pass4:

# --- Test 5 : or ---
ldi r1, 12
ldi r2, 10
or r3, r1, r2
ldi r4, 14
sub r5, r3, r4
brz pass5
ldi r9, e5
st (r9), r8
pass5:

# --- Test 6 : not ---
ldi r1, 0
not r3, r1           # r3 devrait valoir -1 (complément à deux)
ldi r6, 0
ldi r7, 1
sub r4, r6, r7        # r4 = 0 - 1 = -1 (évite un littéral négatif direct dans ldi)
sub r5, r3, r4
brz pass6
ldi r9, e6
st (r9), r8
pass6:

# --- Test 7 : shl ---
ldi r1, 3
shl r3, r1
ldi r4, 6
sub r5, r3, r4
brz pass7
ldi r9, e7
st (r9), r8
pass7:

# --- Test 8 : shr ---
ldi r1, 8
shr r3, r1
ldi r4, 4
sub r5, r3, r4
brz pass8
ldi r9, e8
st (r9), r8
pass8:

# --- Test 9 : mv ---
ldi r1, 99
mv r3, r1
ldi r4, 99
sub r5, r3, r4
brz pass9
ldi r9, e9
st (r9), r8
pass9:

# --- Test 10 : st ---
ldi r1, 77
ldi r9, cellule
st (r9), r1
ld r2, (r9)
ldi r4, 77
sub r5, r2, r4
brz pass10
ldi r9, e10
st (r9), r8
pass10:

# --- Test 11 : ld (avec valeur "leurre" avant pour prouver l'écrasement du registre) ---
ldi r1, 55
ldi r9, cellule
st (r9), r1
ldi r2, 999
ld r2, (r9)
ldi r4, 55
sub r5, r2, r4
brz pass11
ldi r9, e11
st (r9), r8
pass11:

# --- Test 12 : br (saut inconditionnel) ---
ldi r1, 1
br apres_br12
ldi r1, 2
apres_br12:
ldi r4, 1
sub r5, r1, r4
brz pass12
ldi r9, e12
st (r9), r8
pass12:

# --- Test 13 : brz (doit sauter quand Z=1) ---
ldi r1, 5
ldi r2, 5
sub r3, r1, r2
brz t13_saute
ldi r6, 1
br t13_fin
t13_saute:
ldi r6, 0
t13_fin:
ldi r4, 0
sub r5, r6, r4
brz pass13
ldi r9, e13
st (r9), r8
pass13:

# --- Test 14 : brnz (doit sauter quand Z=0) ---
ldi r1, 5
ldi r2, 3
sub r3, r1, r2
brnz t14_saute
ldi r6, 1
br t14_fin
t14_saute:
ldi r6, 0
t14_fin:
ldi r4, 0
sub r5, r6, r4
brz pass14
ldi r9, e14
st (r9), r8
pass14:

# --- Test 15 : brlz (doit sauter quand N=1, résultat négatif) ---
ldi r1, 3
ldi r2, 10
sub r3, r1, r2
brlz t15_saute
ldi r6, 1
br t15_fin
t15_saute:
ldi r6, 0
t15_fin:
ldi r4, 0
sub r5, r6, r4
brz pass15
ldi r9, e15
st (r9), r8
pass15:

# --- Test 16 : brgez (doit sauter quand N=0, résultat non négatif) ---
ldi r1, 10
ldi r2, 3
sub r3, r1, r2
brgez t16_saute
ldi r6, 1
br t16_fin
t16_saute:
ldi r6, 0
t16_fin:
ldi r4, 0
sub r5, r6, r4
brz pass16
ldi r9, e16
st (r9), r8
pass16:

# ===================================================================
# COMPILATION DES RÉSULTATS (accumulation dans r1)
# ===================================================================
ldi r9, e1
ld r1, (r9)
ldi r9, e2
ld r2, (r9)
add r1, r1, r2
ldi r9, e3
ld r2, (r9)
add r1, r1, r2
ldi r9, e4
ld r2, (r9)
add r1, r1, r2
ldi r9, e5
ld r2, (r9)
add r1, r1, r2
ldi r9, e6
ld r2, (r9)
add r1, r1, r2
ldi r9, e7
ld r2, (r9)
add r1, r1, r2
ldi r9, e8
ld r2, (r9)
add r1, r1, r2
ldi r9, e9
ld r2, (r9)
add r1, r1, r2
ldi r9, e10
ld r2, (r9)
add r1, r1, r2
ldi r9, e11
ld r2, (r9)
add r1, r1, r2
ldi r9, e12
ld r2, (r9)
add r1, r1, r2
ldi r9, e13
ld r2, (r9)
add r1, r1, r2
ldi r9, e14
ld r2, (r9)
add r1, r1, r2
ldi r9, e15
ld r2, (r9)
add r1, r1, r2
ldi r9, e16
ld r2, (r9)
add r1, r1, r2          # r1 = total des échecs (flags Z reflète r1 ici)

brz tous_reussis
ldi r6, 0
br apres_resultat
tous_reussis:
ldi r6, 1
apres_resultat:
ldi r9, resultat
st (r9), r6

ldi r9, fail
st (r9), r1

ldi r2, 16
sub r3, r2, r1
ldi r9, pass
st (r9), r3

stop

# --- Test 17 (stop) : validé implicitement par l'arrêt propre du programme ci-dessus ---

.data
resultat:  0 # --- 0x00 (attendu 1 a la fin)
pass:      0 # --- 0x00 (attendu 16 a la fin)
fail:      0 # --- 0x00 (attendu 0 a la fin)
cellule:   0
e1:  0
e2:  0
e3:  0
e4:  0
e5:  0
e6:  0
e7:  0
e8:  0
e9:  0
e10: 0
e11: 0
e12: 0
e13: 0
e14: 0
e15: 0
e16: 0
