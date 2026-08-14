.text

# ===================================================================
# TEST DE VALIDATION - ARCHITECTURE PROCESSEUR-ACCUMULATEUR-MA
# 20 instructions testées, chacune associée à un drapeau d'erreur (eN)
# resultat = 1 (succès total) ou 0 (au moins 1 échec)
# pass     = nombre de tests réussis (sur 18)
# fail     = nombre de tests échoués (sur 18)
# ===================================================================

# --- Test 1 : add ---
ld cinq
add trois
sub huit
brz pass1
ld un
st e1
pass1:

# --- Test 2 : sub ---
ld dix
sub trois
sub sept
brz pass2
ld un
st e2
pass2:

# --- Test 3 : mul ---
ld trois
mul deux
sub six
brz pass3
ld un
st e3
pass3:

# --- Test 4 : ld (avec valeur "leurre" avant pour prouver l'écrasement de ACC) ---
ld dix
ld cinq
sub cinq
brz pass4
ld un
st e4
pass4:

# --- Test 5 : st ---
ld dix
st cible
ld cible
sub dix
brz pass5
ld un
st e5
pass5:

# --- Test 6 : adda ---
lda zero
adda cinq
sta cible
ld cible
sub cinq
brz pass6
ld un
st e6
pass6:

# --- Test 7 : suba ---
lda dix
suba trois
sta cible
ld cible
sub sept
brz pass7
ld un
st e7
pass7:

# --- Test 8 : lda (avec valeur "leurre" dans MA avant, via sta/ld indirect) ---
lda huit
sta cible
lda cinq
sta cible
ld cible
sub cinq
brz pass8
ld un
st e8
pass8:

# --- Test 9 : sta ---
lda huit
sta cible
ld cible
sub huit
brz pass9
ld un
st e9
pass9:

# --- Test 10 : lea + sti (les deux doivent fonctionner ensemble : MA doit contenir
#               l'ADRESSE de cible AVANT que sti n'y écrive) ---
ld dix
lea cible
sti
ld cible
sub dix
brz pass10
ld un
st e10
pass10:

# --- Test 11 : ldi (MA pointe encore sur cible, qui contient 10) ---
lea cible
ld un
ldi
sub dix
brz pass11
ld un
st e11
pass11:

# --- Test 12 : addx (MA pointe toujours sur cible = 10) ---
ld cinq
addx
sub quinze
brz pass12
ld un
st e12
pass12:

# --- Test 13 : subx (MA pointe toujours sur cible = 10) ---
ld vingt
subx
sub dix
brz pass13
ld un
st e13
pass13:

# --- Test 14 : shl ---
ld trois
shl
sub six
brz pass14
ld un
st e14
pass14:

# --- Test 15 : shr ---
ld huit
shr
sub quatre
brz pass15
ld un
st e15
pass15:

# --- Test 16 : br (saut inconditionnel) ---
ld un
br apres_br16
ld deux
apres_br16:
sub un
brz pass16
ld un
st e16
pass16:

# --- Test 17 : brz (doit sauter quand ACC = 0) ---
ld zero
brz t17_saute
ld un
br t17_fin
t17_saute:
ld zero
t17_fin:
brz pass17
ld un
st e17
pass17:

# --- Test 18 : brnz (doit sauter quand ACC != 0) ---
ld un
brnz t18_saute
ld deux
br t18_fin
t18_saute:
ld zero
t18_fin:
brz pass18
ld un
st e18
pass18:

# ===================================================================
# COMPILATION DES RÉSULTATS
# ===================================================================
ld e1
add e2
add e3
add e4
add e5
add e6
add e7
add e8
add e9
add e10
add e11
add e12
add e13
add e14
add e15
add e16
add e17
add e18
st fail
ld dixhuit
sub fail
st pass
ld fail
brz succes
ld zero
st resultat
br fin
succes:
ld un
st resultat
fin:
stop

# --- Test 19 (lea) : validé implicitement aux tests 10, 11 (MA doit être une adresse) ---
# --- Test 20 (stop) : validé implicitement par l'arrêt propre du programme ci-dessus ---

.data
resultat:  0 # --- 0x9b (attendu 1 a la fin)
pass:      0 # --- 0x9c (attendu 18 a la fin)
fail:      0 # --- 0x9d  (attendu 0 a la fin)
zero:      0
un:        1
deux:      2
trois:     3
quatre:    4
cinq:      5
six:       6
sept:      7
huit:      8
dix:       10
quinze:    15
vingt:     20
dixhuit:   18
cible:     0
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
e17: 0
e18: 0
