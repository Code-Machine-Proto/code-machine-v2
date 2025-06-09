/*
 * Copyright (C) 2020-2021 Lightbend Inc. <https://www.lightbend.com>
 */


import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.{ ContentTypes, HttpEntity }
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import spray.json.DefaultJsonProtocol._

import accumulator.execs.accumulator_execs.{ compileAndRunV1, compileAndRunV2 }
import accumulator.execs.{ RunResultsV1, RunResultsV2 }
import risc_simple.RunResultsRiscSimple
import risc_simple.risc_simple_execs.compileAndRun

import scala.io.StdIn
import scala.util.Properties.envOrElse

final case class Program(content: Array[String]);
final case class CompileAndRunRequest(program: Array[String], processorId: Int);

final case class testClass(id: String, age: Int);

object SprayJsonExample {

  // needed to run the route
  implicit val system = ActorSystem(Behaviors.empty, "SprayExample")
  // needed for the future map/flatmap in the end and future in fetchItem and saveOrder
  implicit val executionContext = system.executionContext

  implicit val ProgramMarshaller: spray.json.RootJsonFormat[Program] = jsonFormat1(Program.apply);
  implicit val compileAndRunRequestMarshaller: spray.json.RootJsonFormat[CompileAndRunRequest] = jsonFormat2(CompileAndRunRequest.apply)
  implicit val RunResultsMarshaller: spray.json.RootJsonFormat[RunResultsV1] = jsonFormat2(RunResultsV1.apply);
  implicit val RunResultsV2Marshaller: spray.json.RootJsonFormat[RunResultsV2] = jsonFormat2(RunResultsV2.apply);
  implicit val RunResultsRiscSimpleMarshaller: spray.json.RootJsonFormat[RunResultsRiscSimple] = jsonFormat3(RunResultsRiscSimple.apply)

  def main(args: Array[String]): Unit = {

    val route: Route =
        post {
          path("compileAndRun") {
            entity(as[CompileAndRunRequest]){
              request => {
                if(request.processorId == 0)
                  complete(compileAndRunV1(request.program))
                else if(request.processorId == 1) {
                  complete(compileAndRunV2(request.program))
                }else{
                  complete(compileAndRun(request.program))
                }
              }
            }
          }
        }

    val host = "0.0.0.0"
    val port = envOrElse("PORT", "8080").toInt

    val bindingFuture = Http().newServerAt(host, port).bind(route)
    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine() // let it run until user presses return
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
  }
}