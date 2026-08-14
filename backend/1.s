.text
# Mem[PTR] == target ? ?
compare:
lda pointeur
ldi
sub target
brnz incrementcount

# ++compteur
addone:
ld result
add one
st result

# increment decompte
incrementcount:
ld count
add one
st count
sub n
brz end

# incrementer pointeur
incrementptr:
lda pointeur
adda one
sta pointeur
br compare

end:
ld result
stop
# NE RIEN MODIFIER EN DESSOUS DE CETTE LIGNE
.data
#nums
a: 1   # nums[0]
b: 2   # nums[1]
c: 3   # nums[2]
d: 2   # nums[3]
e: 2   # nums[4]
f: 4   # nums[n - 1]

n: 6 # nbr elements dans nums
target: 2
result: 0
# NE RIEN MODIFIER AU DESSUS DE CETTE LIGNE
one: 1
count: 0
# adresse debut du tableau
pointeur: 18