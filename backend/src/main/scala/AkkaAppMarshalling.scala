/*
 * Copyright (C) 2020-2021 Lightbend Inc. <https://www.lightbend.com>
 */

import accumulator.accumulator_v2.accumulator_v2
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import accumulator.execs._
import risc_simple.exec._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import risc_simple.RunResultsRiscSimple
import spray.json.DefaultJsonProtocol._

import scala.io.StdIn

// --------------------
// Case classes
// --------------------
final case class Program(content: Array[String])
final case class CompileAndRunRequest(program: Array[String], processorId: Int)
final case class testClass(id: String, age: Int)

// --------------------
// JSON Marshallers
// --------------------
object JsonFormats {
  implicit val ProgramMarshaller = jsonFormat1(Program.apply)
  implicit val compileAndRunRequestMarshaller = jsonFormat2(
    CompileAndRunRequest.apply
  )
  implicit val testClassMarshaller = jsonFormat2(testClass.apply)
  implicit val RunResultsMarshaller = jsonFormat2(RunResultsV1.apply)
  implicit val RunResultsV2Marshaller = jsonFormat2(RunResultsV2.apply)
  implicit val RunResultsRiscSimpleMarshaller = jsonFormat3(
    RunResultsRiscSimple.apply
  )
}

// --------------------
// Main server
// --------------------
object SprayJsonExample {

  import JsonFormats._

  implicit val system = ActorSystem(Behaviors.empty, "SprayExample")
  implicit val executionContext = system.executionContext

  // --------------------
  // CORS configuration
  // --------------------
  private val corsHeaders = List(
    `Access-Control-Allow-Origin`(HttpOrigin("http://localhost:5173")),
    `Access-Control-Allow-Credentials`(true),
    `Access-Control-Allow-Headers`("Content-Type", "Authorization"),
    `Access-Control-Allow-Methods`(
      HttpMethods.GET,
      HttpMethods.POST,
      HttpMethods.OPTIONS
    )
  )

  private def withCors(route: Route): Route =
    respondWithHeaders(corsHeaders)(route)

  def main(args: Array[String]): Unit = {

    println("=== ALOOOOOOOOO ===")

    val content =
      """|<html>
         |<head></head>
         |<body>
         |AkkaHttp!
         |</body>
         |</html>
         |""".stripMargin

    val routes: Route = {
      println("=== ROUTES BEING BUILT ===")
      respondWithHeaders(corsHeaders) {
        concat(
          options {
            extractUnmatchedPath { path =>
              println(s"=== OPTIONS REQUEST RECEIVED for path: $path ===")
              complete(StatusCodes.OK)
            }
          },
          get {
            path("") {
              println("=== GET / REQUEST ===")
              complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, content))
            }
          },
          post {
            path("compileAndRun") {
              println("=== POST /compileAndRun REQUEST ===")
              entity(as[CompileAndRunRequest]) { request =>
                println(
                  s"=== Request received: processorId=${request.processorId}, program length=${request.program.length} ==="
                )
                if (request.processorId == 0)
                  complete(
                    accumulator.execs.accumulator_execs
                      .compileAndRunV1(request.program)
                  )
                else if (request.processorId == 1)
                  complete(
                    accumulator.execs.accumulator_execs
                      .compileAndRunV2(request.program)
                  )
                else {

                  complete(
                    risc_simple.risc_simple_execs.compileAndRun(request.program)
                  )
                }
              }
            }
          },
          get {
            path("testClass") {
              println("=== GET /testClass REQUEST ===")
              complete(testClass("oui", 18))
            }
          }
        )
      }
    }

    val routesWithLogging: Route =
      extractRequest { request =>
        println(
          s"=== INCOMING REQUEST: ${request.method.value} ${request.uri} ==="
        )
        routes
      }

    val host = "0.0.0.0"
    val port = scala.util.Properties.envOrElse("PORT", "8080").toInt
    val bindingFuture = Http().newServerAt(host, port).bind(routesWithLogging)

    println(s"Server online at http://localhost:$port/")
    println("Press RETURN to stop...")
    StdIn.readLine()

    bindingFuture
      .flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }
}
