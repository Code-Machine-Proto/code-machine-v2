.text
lea addmem
iteration:
ld somme
addx
st somme
ld indice
sub  one
st indice
adda one
brnz iteration
stop
.data
somme: 0 // Résultat attendu: somme = 285 à la fin du programme
indice: 9
one: 1
addmem: 1
4
9
16
25
36
49
64
81