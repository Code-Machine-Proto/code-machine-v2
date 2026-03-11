.text

# --- br : branchement inconditionnel ---
ldi r1, 42
ldi r20, res_br
br br_ok
ldi r1, 0           # ne doit PAS s'executer
br_ok:
st (r20), r1        # mem[res_br] = 42

# --- brz : Z=1 (resultat nul) ---
ldi r1, 55
ldi r20, res_brz
ldi r3, 7
sub r3, r3, r3      # r3 = 0, Z=1
brz brz_ok
ldi r1, 0
br brz_end
brz_ok:
st (r20), r1        # mem[res_brz] = 55
brz_end:

# --- brnz : Z=0 (resultat non nul) ---
ldi r20, res_brnz
ldi r3, 5
ldi r4, 3
sub r3, r3, r4      # r3 = 2, Z=0
brnz brnz_ok
ldi r3, 0
br brnz_end
brnz_ok:
st (r20), r3        # mem[res_brnz] = 2
brnz_end:

# --- brlz : N=1 (resultat negatif) ---
ldi r1, 77
ldi r20, res_brlz
ldi r3, 3
ldi r4, 8
sub r3, r3, r4      # r3 = -5, N=1
brlz brlz_ok
ldi r1, 0
br brlz_end
brlz_ok:
st (r20), r1        # mem[res_brlz] = 77
brlz_end:

# --- brgez : N=0 (resultat >= 0) ---
ldi r20, res_brgez
ldi r3, 9
ldi r4, 4
sub r3, r3, r4      # r3 = 5, N=0
brgez brgez_ok
ldi r3, 0
br brgez_end
brgez_ok:
st (r20), r3        # mem[res_brgez] = 5
brgez_end:

stop

.data
res_br:    0
res_brz:   0
res_brnz:  0
res_brlz:  0
res_brgez: 0

# === RÉSULTATS ATTENDUS ===
# mem[res_br]    = 42   (br    : inconditionnel)
# mem[res_brz]   = 55   (brz   : 7-7=0,  Z=1)
# mem[res_brnz]  = 2    (brnz  : 5-3=2,  Z=0)
# mem[res_brlz]  = 77   (brlz  : 3-8=-5, N=1)
# mem[res_brgez] = 5    (brgez : 9-4=5,  N=0)
#
# Toute valeur 0 indique un branchement raté.
