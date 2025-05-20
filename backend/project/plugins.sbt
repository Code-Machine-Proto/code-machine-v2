logLevel := Level.Warn
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.7.6")
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.0.0")
libraryDependencies += "ch.qos.logback" % "logback-classic" % "1.2.3"