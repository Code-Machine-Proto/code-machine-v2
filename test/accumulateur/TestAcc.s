.text

# ===================================================================
# TEST DE VALIDATION - ARCHITECTURE PROCESSEUR-ACCUMULATEUR (SIMPLE)
# 9 instructions testées : 8 avec drapeau (e1-e8), stop implicite
# resultat = 1 (succès total) ou 0 (au moins 1 échec)
# pass     = nombre de tests réussis (sur 8)
# fail     = nombre de tests échoués (sur 8)
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

# --- Test 6 : br (saut inconditionnel) ---
ld un
br apres_br6
ld deux
apres_br6:
sub un
brz pass6
ld un
st e6
pass6:

# --- Test 7 : brz (doit sauter quand ACC = 0) ---
ld zero
brz t7_saute
ld un
br t7_fin
t7_saute:
ld zero
t7_fin:
brz pass7
ld un
st e7
pass7:

# --- Test 8 : brnz (doit sauter quand ACC != 0) ---
ld un
brnz t8_saute
ld deux
br t8_fin
t8_saute:
ld zero
t8_fin:
brz pass8
ld un
st e8
pass8:

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
st fail
ld huit
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

# --- Test 9 (stop) : validé implicitement par l'arrêt propre du programme ci-dessus ---

.data
resultat:  0  # --- 0x4a (attendu 1 a la fin)
pass:      0 # --- 0x4b (attendu 8 a la fin)
fail:      0 # --- 0x4c (attendu 0 a la fin)
zero:      0
un:        1
deux:      2
trois:     3
cinq:      5
six:       6
sept:      7
huit:      8
dix:       10
cible:     0
e1:  0
e2:  0
e3:  0
e4:  0
e5:  0
e6:  0
e7:  0
e8:  0
