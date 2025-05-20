import scala.math.BigInt

val byteArray = BigInt(465).toByteArray

for(byte <- byteArray){
  System.out.println(byte.toBinaryString)
}
