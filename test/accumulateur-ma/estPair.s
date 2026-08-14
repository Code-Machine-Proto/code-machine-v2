# Solution possible: Est pair? [MA]
.text
clearLsb:
# n >> 1
ld n
shr
#n' =  (n >> 1) << 1
shl
st temp
#if (n != n') --> impair
ld n
sub temp
brnz odd

even:
ld one
stop

odd:
ld zero
stop

.data
n: 4
temp: 0

one: 1
zero: 0

// Résultat attendu: ACC = 1 à la fin du programme