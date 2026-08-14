.text
# n == 0?
ld n
brz returnZero

# n == 1?
ld n
sub one
brz returnOne
st n

# second = second + first
# first = second
loop:
ld second
add first
st temp
ld second
st first
ld temp
st second

incrementCount:
ld n
sub one
st n
brnz loop 

ld second
stop

returnZero:
ld first
stop

returnOne:
ld second
stop

.data
n: 10

first: 0
second: 1

temp: 0

one: 1

// Résultat attendu: ACC = 55 à la fin du programme
